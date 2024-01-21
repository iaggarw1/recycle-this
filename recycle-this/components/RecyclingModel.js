import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { Platform } from 'react-native';
async function RecyclingModel(prompt){
    console.log("wakie talkie")
    const model = await tf.loadLayersModel('localstorage://text_model');
    const pred = await model.predict(prompt)
    console.log(pred);
    console.log("well the function works ig")
}