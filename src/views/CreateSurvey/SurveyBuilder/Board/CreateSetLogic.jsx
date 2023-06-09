/** Final working code for cteating max diff set as per the bellow condition 
 *  It should create set with number of option same as attribute per task 
 *  It should reate attribute as per selection of repeate attribute in accross all set
 *  Attribute set don't have same option in single set 
 *  No of set should be define by = (max_attr / attr_per_task) * repeat_attr;
*/
createMaxdiffSet = () => {
    let fieldprops = this.state.fieldprops
    let max_attr = fieldprops.properties.Maximum_Attributes ? fieldprops.properties.Maximum_Attributes.value : 0
    let attr_per_task = fieldprops.properties.Attribute_PerTask ? fieldprops.properties.Attribute_PerTask.value : 0
    let repeat_attr = fieldprops.properties.Repeate_Attribute ? fieldprops.properties.Repeate_Attribute.value : 0
    const num_sets = (max_attr / attr_per_task) * repeat_attr;
    let tempAtt = fieldprops.properties.attribute_data

    let setOfAttribute = [];
    let occurrences = {}; // Track occurrences of each item
    const maxAttempts = 10000; // Maximum number of attempts to find suitable combinations

    // Loop through num_sets and generate subarrays
    for (let i = 0; i < num_sets; i++) {
        let subarray = [];

        // Loop until subarray is filled with unique attributes or until maximum attempts is reached
        let attempts = 0;
        while (subarray.length < attr_per_task && attempts < maxAttempts) {
            let randomIndex = Math.floor(Math.random() * max_attr);
            let randomItem = tempAtt[randomIndex];

            // Check if the random item has exceeded the desired count (repeat_attr) in the subarray
            if (
                !subarray.includes(randomItem) &&
                (!occurrences[randomIndex] || occurrences[randomIndex] < repeat_attr)
            ) {
                subarray.push(randomItem);
                // Update the occurrences for the selected random item
                occurrences[randomIndex] = occurrences[randomIndex] ? occurrences[randomIndex] + 1 : 1;
            }
            attempts++;
        }

        // If subarray is not filled with unique attributes or maximum attempts is reached,
        // reset setOfAttribute and start over from the beginning
        if (subarray.length < attr_per_task || attempts === maxAttempts) {
            setOfAttribute = [];
            occurrences = {};
            i = -1;
        } else {
            subarray = subarray.map((element) => {
                return { ...element, attributeSetID: i };
            });
            setOfAttribute.push(subarray);
        }
    }

    fieldprops.properties['attribute_Set'] = setOfAttribute
    this.setState({
        fieldprops
    })
}

//Logic for create set but issue with looping and some time stuck if value is big
// createMaxdiffSet = () => {
//     let fieldprops = this.state.fieldprops
//     let max_attr = fieldprops.properties.Maximum_Attributes ? fieldprops.properties.Maximum_Attributes.value : 0
//     let attr_per_task = fieldprops.properties.Attribute_PerTask ? fieldprops.properties.Attribute_PerTask.value : 0
//     let repeat_attr = fieldprops.properties.Repeate_Attribute ? fieldprops.properties.Repeate_Attribute.value : 0
//     const num_sets = (max_attr / attr_per_task) * repeat_attr;
//     let tempAtt = fieldprops.properties.attribute_data

//     let setOfAttribute = [];
//     let occurrences = {}; // Track occurrences of each item
//     // Loop through num_sets and generate subarrays
//     for (let i = 0; i < num_sets; i++) {
//         console.log('No of time for loop occured', i)
//         let subarray = [];

//         // Loop until subarray is filled with unique attributes or until maximum attempts is reached
//         let attempts = 0;
//         while (subarray.length < attr_per_task && attempts < max_attr) {
//             let randomIndex = Math.floor(Math.random() * max_attr);
//             let randomItem = tempAtt[randomIndex];

//             // Check if the random item has exceeded the desired count (repeat_attr) in the subarray
//             if (!subarray.includes(randomItem) && (!occurrences[randomIndex] || occurrences[randomIndex] < repeat_attr)) {
//                 subarray.push(randomItem);
//                 // Update the occurrences for the selected random item
//                 occurrences[randomIndex] = occurrences[randomIndex] ? occurrences[randomIndex] + 1 : 1;
//             }
//             attempts++;
//         }

//         // If subarray is not filled with unique attributes, reset setOfAttribute and start over from the beginning
//         if (subarray.length < attr_per_task) {
//             setOfAttribute = [];
//             occurrences = {};
//             i = -1;
//         } else {
//             subarray = subarray.map(element => {
//                 return { ...element, attributeSetID: i };
//             });
//             setOfAttribute.push(subarray);
//         }
//     }

//     console.log('Final set of arrtibute is', setOfAttribute)
//     fieldprops.properties['attribute_Set'] = setOfAttribute
//     this.setState({
//         fieldprops
//     })
// }

//===============================================================
// Logic for create set but issue with repet element
// createMaxdiffSet = () => {
//     let fieldprops = this.state.fieldprops
//     let max_attr = fieldprops.properties.Maximum_Attributes ? fieldprops.properties.Maximum_Attributes.value : 0
//     let attr_per_task = fieldprops.properties.Attribute_PerTask ? fieldprops.properties.Attribute_PerTask.value : 0
//     let repeat_attr = fieldprops.properties.Repeate_Attribute ? fieldprops.properties.Repeate_Attribute.value : 0
//     const num_sets = (max_attr / attr_per_task) * repeat_attr;
//     let tempAtt = fieldprops.properties.attribute_data

//     let setOfAttribute = [];
//     // Loop through num_sets and generate subarrays
//     for (let i = 0; i < num_sets; i++) {
//         let subarray = [];

//         // Loop until subarray is filled with unique attributes or until maximum attempts is reached
//         let attempts = 0;
//         while (subarray.length < attr_per_task && attempts < max_attr) {
//             let randomItem = tempAtt[Math.floor(Math.random() * max_attr)];
//             if (!subarray.includes(randomItem) && !this.hasOccured(setOfAttribute, randomItem, repeat_attr)) {
//                 subarray.push(randomItem);
//             }
//             attempts++;
//         }

//         // If subarray is not filled with unique attributes, reset setOfAttribute and start over from the beginning
//         if (subarray.length < attr_per_task) {
//             setOfAttribute = [];
//             i = -1;
//         } else {
//             subarray = subarray.map(element => {
//                 return { ...element, attributeSetID: i };
//             });
//             setOfAttribute.push(subarray);
//         }
//     }

//     console.log('Final set of arrtibute is', setOfAttribute)
//     fieldprops.properties['attribute_Set'] = setOfAttribute
//     this.setState({
//         fieldprops
//     })
// }
