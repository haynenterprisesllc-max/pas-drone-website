PATRIOT AERIAL SOLUTIONS — DIRECT QUOTE FORM

This version removes the founder's name from the public website.

The quote form now:
- Submits without opening the visitor's email program
- Sends the request through Cloudflare Pages Functions
- Emails HaynEnterprisesLLC@gmail.com
- Uses quotes@pas-drone.com as the website sender
- Lets you reply directly to the prospective customer's email
- Includes basic server-side validation and spam honeypot protection

UPLOAD THESE ITEMS TO THE ROOT OF GITHUB:
- index.html
- assets folder
- functions folder
- wrangler.jsonc

CLOUDFLARE SETUP REQUIRED:
1. In Cloudflare, open Compute > Email Service > Email Sending.
2. Onboard pas-drone.com and allow Cloudflare to add the required DNS records.
3. Add and verify HaynEnterprisesLLC@gmail.com as a destination address.
4. Confirm the Pages project is connected to this GitHub repository.
5. Redeploy after uploading all files.
6. Test the form from https://pas-drone.com.

IMPORTANT:
Cloudflare's native outbound Email Sending feature may require the Workers Paid plan.
The form code is complete, but email delivery will not work until the EMAIL binding and domain are enabled in Cloudflare.
