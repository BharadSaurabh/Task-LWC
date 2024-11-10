import { LightningElement,wire,track } from 'lwc';

import tasklist from '@salesforce/apex/TaskApex.tasklist';
import updateTaskStatus from '@salesforce/apex/TaskApex.updateTaskStatus';


import { ShowToastEvent } from 'lightning/platformShowToastEvent';


//   const column =[
    
//        { label: 'Task Name', fieldName:'Name'},
//        { label: 'Description', fieldName:'Description__c'},
//        { label: 'Due Date', fieldName:'Due_Date__c'},
//        { label: 'Priority', fieldName:'Priority__c'},
//         { label: 'Status', fieldName: 'Status', type: 'picklist', typeAttributes: { 
//             placeholder: 'Choose Status', options: [
//                 { label: 'Not Started', value: 'Not Started' },
//                 { label: 'In Progress', value: 'In Progress' },
//                 { label: 'Completed', value: 'Completed' }
//             ], value: { fieldName: 'Status' }, 
//             context: { fieldName: 'Id' } 
//         }, editable: true }
    

//   ];



export default class TaskManager extends LightningElement {

    @track draftValues = [];

    column =[
    
       { label: 'Task Name', fieldName:'Name'},
       { label: 'Description', fieldName:'Description__c'},
       { label: 'Due Date', fieldName:'Due_Date__c'},
       { label: 'Priority', fieldName:'Priority__c'},

        { label: 'Status', fieldName: 'Status__c', type: 'picklist', typeAttributes: { 
            placeholder: 'Choose Status', options: [
                { label: 'Not Started', value: 'Not Started' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' }
            ], value: { fieldName: 'Status' }, 
            context: { fieldName: 'Id' } 
        }, editable: true }
    

  ];



    isfrrvisble = false;

// columnsList = column;

    data = [];



    @wire(tasklist)
    taskdataset({data,error}){
        if(data){
            this.data = data;
        }
        else if(error){
            console.log(error);

        }
    }



    handleSubmit(event){
        
         const fields = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(fields);

        this.isfrrvisble = false;

    }

    
   handleSucess(event){

        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord);

        const event1 = new ShowToastEvent({
            title: 'Task  Created is Successfully',
            message: 'Task Create',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event1);
        window.location.reload();
     }

      handleView(){

        this.isfrrvisble = true;

    }


    handleSave(event) {
        const updatedFields = event.detail.draftValues;
        updateTaskStatus({ tasksToUpdate: updatedFields })
            .then(() => {
                this.showToast('Success', 'Status updated successfully!', 'success');
                return refreshApex(this.tasks);
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }
    


   
}