import { Animation } from "../animation/animation";
import { TransformTo } from "../animation/transformto";
import { Transitioneer } from "../animation/transitioneer";

const anim = Animation;
anim.transformTo = TransformTo;
anim.transitioneer = Transitioneer;

export default anim;