import os

import requests
import sendgrid
from flask import Flask, flash, redirect, render_template, request
from sendgrid.helpers.mail import Content, Email, Mail, To

app = Flask(__name__)
app.secret_key = os.environ.get('APP_SECRET')

recaptcha_secret = os.environ.get('RECAPTCHA_SECRET')


def send_contact_mail(body):
    ''' send an email via the SendGrid API '''
    sg = sendgrid.SendGridAPIClient(
        api_key=os.environ.get('SG_API_KEY'))
    from_email = Email('website@dylanconstructionltd.com')
    to_email = To('craig@dylanconstructionltd.com')
    content = Content("text/plain", body)
    mail = Mail(from_email, to_email, 'New Website Contact', content)
    response = sg.client.mail.send.post(request_body=mail.get())
    return response.status_code


@app.route('/')
def home():
    return render_template('index.html')


@app.route("/contact", methods=['POST'])
def contact():

    recaptcha_resp = request.form.get('g-recaptcha-response')

    if not recaptcha_resp:
        flash('Oops, please prove you are human below:')
        return redirect('/#contact')

    else:

        validate_recaptcha = requests.post(
            f'https://www.google.com/recaptcha/api/siteverify?secret={recaptcha_secret}&response={recaptcha_resp}').json()

        if validate_recaptcha['success'] == True:

            # send the form data (body) to the send_contact_mail helper
            response = send_contact_mail(body='\n\nName: ' + request.form.get('name')
                                         + '\n\nEmail: ' +
                                         request.form.get('email')
                                         + '\n\nMessage: ' + request.form.get('message'))

            # check the response from the SendGrid API
            if response == 202:
                flash('Thanks, your message was sent and we will be in touch soon!')
            else:
                flash('Oops, something went wrong, please try again later!')

        else:
            flash("Sorry, we aren't convinced you are a human!")

        return redirect('/#contact')


if __name__ == '__main__':
    app.run(debug=False)
