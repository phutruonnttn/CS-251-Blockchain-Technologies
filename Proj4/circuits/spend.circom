include "./mimc.circom";

/*
 * IfThenElse sets `out` to `true_value` if `condition` is 1 and `out` to
 * `false_value` if `condition` is 0.
 *
 * It enforces that `condition` is 0 or 1.
 *
 */

template IfThenElse() {
    signal input condition;
    signal input true_value;
    signal input false_value;
    signal output out;

    condition * (condition-1) === 0;

    out <== (true_value - false_value)*condition + false_value;
}

/*
 * SelectiveSwitch takes two data inputs (`in0`, `in1`) and produces two ouputs.
 * If the "select" (`s`) input is 1, then it inverts the order of the inputs
 * in the ouput. If `s` is 0, then it preserves the order.
 *
 * It enforces that `s` is 0 or 1.
 */
template SelectiveSwitch() {
    signal input in0;
    signal input in1;
    signal input s;
    signal output out0;
    signal output out1;

    component ifThenElse1 = IfThenElse();
    ifThenElse1.condition <== s;
    ifThenElse1.true_value <== in1;
    ifThenElse1.false_value <== in0;

    out0 <== ifThenElse1.out;

    component ifThenElse2 = IfThenElse();
    ifThenElse2.condition <== s;
    ifThenElse2.true_value <== in0;
    ifThenElse2.false_value <== in1;

    out1 <== ifThenElse2.out;
}

// Computes MiMC([left, right])
template HashLeftRight() {
    signal input left;
    signal input right;
    signal output hash;

    component hasher = Mimc2();
    hasher.in0 <== left;
    hasher.in1 <== right;
    hash <== hasher.out;
}

/*
 * Verifies the presence of H(`nullifier`, `nonce`) in the tree of depth
 * `depth`, summarized by `digest`.
 * This presence is witnessed by a Merle proof provided as
 * the additional inputs `sibling` and `direction`, 
 * which have the following meaning:
 *   sibling[i]: the sibling of the node on the path to this coin
 *               at the i'th level from the bottom.
 *   direction[i]: "0" or "1" indicating whether that sibling is on the left.
 *       The "sibling" hashes correspond directly to the siblings in the
 *       SparseMerkleTree path.
 *       The "direction" keys the boolean directions from the SparseMerkleTree
 *       path, casted to string-represented integers ("0" or "1").
 */
template Spend(depth) {
    signal input digest;
    signal input nullifier;
    signal private input nonce;
    signal private input sibling[depth];
    signal private input direction[depth];
    
    component hasher = HashLeftRight();
    hasher.left <== nullifier;
    hasher.right <== nonce;
    signal leaf = hasher.hash;

    component selectors[depth];
    component hashers[depth];

    signal hashes[depth + 1];
    hashes[0] <== leaf;

    for (var i = 0; i < depth; i++) {
        selectors[i] = SelectiveSwitch();
        selectors[i].in0 <== i == 0 ? leaf : hashers[i - 1].hash;
        selectors[i].in1 <== sibling[i];
        selectors[i].s <== direction[i];

        hashers[i] = HashLeftRight();
        hashers[i].left <== selectors[i].out0;
        hashers[i].right <== selectors[i].out1;

        hashes[i + 1] <== hashers[i].hash;
    }

    digest === hashes[depth];
}
