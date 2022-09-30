import debug from "./debug";
import deepmerge from 'deepmerge'
import cloneDeep from "lodash.clonedeep";
import advancedCompare from "./advancedCompare";
import parseString from "./parseString";

export default function utilsInit(){
    window.debug = debug
    window.mergeDeep = deepmerge
    window.cloneDeep = cloneDeep
    window.advancedCompare = advancedCompare
    window.parseString = parseString
}