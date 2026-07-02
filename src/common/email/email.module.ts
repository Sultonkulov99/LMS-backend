// import { MailerModule } from "@nestjs-modules/mailer";
// import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
// import { Global, Module } from "@nestjs/common";
// import { join } from "path";
// import { EmailService } from "./email.service";

// @Global()
// @Module({
//     imports: [
//         MailerModule.forRoot({
//             transport: {
//                 service: "gmail",
//                 auth: {
//                     user: "abdukhoshim99@gmail.com",
//                     pass: "rtbbklnpqhrdbnjd"
//                 }
//             },
//             defaults: {
//                 from: `Web Practikum <${process.env.user}>`
//             },
//             template: {
//                 dir: join(process.cwd(), "src", 'templates'),
//                 adapter: new HandlebarsAdapter(),
//                 options: {
//                     strict: true,
//                 },
//             },

//         })

//     ],
//     providers:[EmailService],
//     exports:[EmailService]
// })

// export class EmailModule{}