export const sendEventFirstProvider = (eventName: string, eventProperties: Object) => {
    console.log('analytics 1', { eventName, eventProperties, });
  }
  
export const sendEventSecondProvider = (eventName: string, eventProperties: Object) => {
    console.log('analytics 2', { eventName, eventProperties, });
  }  
  