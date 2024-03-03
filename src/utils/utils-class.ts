// Error here is moonoose inbulit class that is  err: Error,
// we are chaing it to  err: ErrorHandler,
class ErrorHandler extends Error {
    constructor(public message: string, public statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export default ErrorHandler;