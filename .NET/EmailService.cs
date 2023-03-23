using Sabio.Services.Interfaces;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using Task = System.Threading.Tasks.Task;
using Sabio.Data.Providers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;
using Sabio.Models.Requests;
using Sabio.Models.AppSettings;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Formatters;
using Sabio.Models.Requests.Users;
using Sabio.Models.Domain.Stripe;

namespace Sabio.Services
{
    public class EmailService : IEmailService
    {
        IDataProvider _data = null;
        private IWebHostEnvironment _hostData;
        private ApiKeys _apiKeys;
        private Emails _emails;
        private HostUrl _url;

        public EmailService(IOptions<ApiKeys> apiKeys, IOptions<Emails> emails, IOptions<HostUrl> url, IDataProvider data, ILogger<EmailService> logger, IWebHostEnvironment hostData)
        {
            _data = data;
            _hostData = hostData;
            _apiKeys = apiKeys.Value;
            Configuration.Default.AddApiKey("api-key", _apiKeys.SendInBlueApiKey);
            _emails = emails.Value;
            _url = url.Value;
        }

        public string GetConfirmationTemplate()
        {

            string contentRootPath = _hostData.WebRootPath;
            string path = Path.Combine(contentRootPath, "EmailTemplates", "makai-confirmation_2023-02-25T225912.755411.html");
            string domain = "templates-email-makai.com";
            string template = System.IO.File.ReadAllText(path).Replace("{{domain}}", domain);

            return template;
        }

        public string GetConfirmEmailTemplate()
        {
            string contentRootPath = _hostData.WebRootPath;
            string path = Path.Combine(contentRootPath, "EmailTemplates", "makai-user-confirmation-email.html");
            string domain = _url.Url;
            string template = System.IO.File.ReadAllText(path).Replace("{{domain}}", domain);
            return template;
        }

        public async void SendContactUsEmail(ContactUsRequest model)
        {
            var senderName = model.FirstName + " " + model.LastName;
            var senderEmail = model.Email;

            #region <----Email Data----|
            var ContactAdminEmail = new SendSmtpEmail(
                sender: new SendSmtpEmailSender(
                name: senderName,
                email: senderEmail),
                to: new List<SendSmtpEmailTo> {
                new SendSmtpEmailTo(
                email: _emails.AdminEmail,
                name: "Admin")},
                subject: $"{senderName} Contact Request",
                textContent: model.Message);

            var ConfirmationEmail = new SendSmtpEmail(
                sender: new SendSmtpEmailSender(
                name: "Admin",
                email: _emails.AdminEmail),
                to: new List<SendSmtpEmailTo> {
                new SendSmtpEmailTo(
                email: senderEmail,
                name: senderName)},
                subject: $"Confirmation: {senderName} thank you for contacting Makai Rentals",
                textContent: model.Message);

            var confirmHtmlContent = GetConfirmationTemplate();
            #endregion

            var msg = new SendSmtpEmail(ContactAdminEmail.Sender, ContactAdminEmail.To, null, null, null, ContactAdminEmail.TextContent, ContactAdminEmail.Subject);
            var confirmMsg = new SendSmtpEmail(ConfirmationEmail.Sender, ConfirmationEmail.To, null, null, confirmHtmlContent, null, ConfirmationEmail.Subject);

            await SendEmails(msg);
            await SendEmails(confirmMsg);
        }

        public async void SendEmailConfirm(UserAddRequest model, string emailToken)
        {
            var receiverName = $"{model.FirstName} {model.LastName}";
            var receiverEmail = model.Email;

            var ConfirmationEmail = new SendSmtpEmail(
              sender: new SendSmtpEmailSender(
              name: "Makai Rentals",
              email: _emails.AdminEmail),
              to: new List<SendSmtpEmailTo> {
                new SendSmtpEmailTo(
                email: receiverEmail,
                name: receiverName)},
              subject: "Makai Rentals: Confirm email",
              textContent: null);

            string confirmEmailHtmlContent = GetConfirmEmailTemplate();
            string updatedEmail = confirmEmailHtmlContent.Replace("$token", emailToken).Replace("$email", $"{receiverEmail}");

            var confirmMsg = new SendSmtpEmail(ConfirmationEmail.Sender, ConfirmationEmail.To, null, null, updatedEmail, null, ConfirmationEmail.Subject);

            await SendEmails(confirmMsg);
        }

        private async Task SendEmails(SendSmtpEmail sendSmtpEmail)
        {
            var apiInstance = new TransactionalEmailsApi();
            await apiInstance.SendTransacEmailAsync(sendSmtpEmail);
        }
    }
}