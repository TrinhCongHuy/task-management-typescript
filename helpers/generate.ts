export const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = "";
     for(let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
     }
     return token;
}

export const generateRandomNumber = (length: number): string => {
   const characters = '0123456789';
   let otp = "";
    for(let i = 0; i < length; i++) {
       otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
}