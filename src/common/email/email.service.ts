// import { MailerService } from "@nestjs-modules/mailer";
// import {Injectable } from "@nestjs/common";

// @Injectable()
// export class EmailService{
//     constructor(private mailerService : MailerService){}
//     async sendEmail(email:string,phone:string,password:string){
//         await this.mailerService.sendMail({
//             to:email,
//             subject:"Tizimga kirish uchun login/parol",
//             template:"index",
//             context:{
//                 phone,
//                 password
//             }
//         })
//     }
// }