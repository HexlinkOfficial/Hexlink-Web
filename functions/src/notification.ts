import type {Token} from "../common/lib";

export function getAuthenticationNotification(receipt: string, otp: string) {
  receipt = receipt.toLowerCase();
  return {
    from: "Hexlink <no-reply@hexlink.io>",
    to: receipt,
    subject: `Hexlink Confirmation Code: ${otp}`,
    text: `Hi,\n\nThank you for choosing Hexlink. Use the following OTP to confirm your transaction procedures. OTP is valid for 5 minute.\n${otp}\n\nRegards,\nHexlink`,
    html: `<html lang="en-US">
  
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>New Account Email Template</title>
            <meta name="description" content="New Account Email Template.">
            <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
            </style>
        </head>
  
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!-- 100% body table -->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <a href="play.hexlink.io" title="logo" target="_blank">
                                          <img width="300" src="https://i.postimg.cc/HkJWJSNj/hexlink.png" title="logo" alt="logo">
                                        </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px; background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Verify Your Transaction
                                                </h1>
                                                <p style="font-size:15px; color:#455056; margin:8px 0 0; line-height:24px;">
                                                    Please use the following verification code to complete your transaction procedures.
                                                </p>
                                                <br>
                                                <span style="margin:10px;"><strong>Code is valid for 5 minutes</strong>.</span><br>
                                                <span style="display:inline-block; vertical-align:middle; margin:15px 0 15px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:18px;line-height:20px; margin:0; font-weight: 500;">
                                                    <strong style="display: block;font-size: 13px; margin: 0 0 5px; color:rgba(0,0,0,.64); font-weight:normal;">Verification Code</strong>
                                                    <h2 style="font-size:2.5em; background: #1890ff;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>dev.hexlink.io</strong> </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
  
        </html>`,
  };
}

export function getNewTransferNotification(
    sender: string,
    receipt: string,
    token: Token,
    sendAmount: string
) {
  receipt = receipt.toLowerCase();
  return {
    from: "Hexlink <no-reply@hexlink.io>",
    to: receipt,
    subject: `You received ${token.symbol}!`,
    text: `Hi,\n\nThank you for choosing Hexlink. ${sender} sends you ${sendAmount}&nbsp; ${token.symbol}!\n\nRegards,\nHexlink`,
    html: `<html lang="en-US">
          <head>
              <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
              <title>New Account Email Template</title>
              <meta name="description" content="New Account Email Template.">
              <style type="text/css">
                  a:hover {text-decoration: underline !important;}
              </style>
          </head>
          <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
              <!-- 100% body table -->
              <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                  style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                  <tr>
                      <td>
                          <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                              align="center" cellpadding="0" cellspacing="0">
                              <tr>
                                  <td style="height:80px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="text-align:center;">
                                      <a href="dev.hexlink.io" title="logo" target="_blank">
                                      <img width="300" src="https://i.postimg.cc/HkJWJSNj/hexlink.png" title="logo" alt="logo">
                                    </a>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:20px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td>
                                      <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                          style="max-width:670px; background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); margin: 0 10px;">
                                          <tr>
                                              <td style="height:40px;">&nbsp;</td>
                                          </tr>
                                          <tr>
                                              <td style="padding:0 35px;">
                                                <div>
                                                  <p style="font-size:1.5em; background: #1890ff; margin: 0 auto;width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">🤑 You got cryptos!</p>
                                                    <p style="font-size:1.25em;">🚀 A friendly reminder from the <a href="https://www.hexlink.io/">Hexlink</a> Team. You just got cryptos sent to your account! 💸</p>
                                                    <table style="margin: 0 0 25px;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tr>
                                                        <td style="background-color: #F4F4F7; padding: 16px 100px; display: inline-block;">
                                                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                                            <tr>
                                                              <td style="display: flex;justify-content: flex-start;line-height: 1.5;">
                                                                <strong>Received:&nbsp;</strong> 
                                                                <div style="display: flex;">
                                                                  <img width="20" height="20" src="${token.logoURI}" title="logo" alt="logo">
                                                                  <span><strong>&nbsp;${sendAmount}&nbsp;${token.symbol}</strong></span>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <td style="display: flex; justify-content: flex-start; line-height: 1.5;">
                                                                <strong>From:&nbsp; ${sender}</strong>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                                      <tr>
                                                        <td align="center">
                                                          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tr>
                                                              <td align="center">
                                                                <a href="https://dev.hexlink.io/" style="background-color: #1890ff; border-top: 10px solid #1890ff; border-right: 18px solid #1890ff; border-bottom: 10px solid #1890ff; border-left: 18px solid #1890ff; display: inline-block; color: #FFF; text-decoration: none; border-radius: 3px; -webkit-text-size-adjust: none; box-sizing: border-box;" target="_blank">Check Your Tokens</a>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                          <p style="margin: 40px 0 10px 0;">If you have any questions about this, simply reach out to our support team at info@hexlink.io</p>
                                                          <p>Cheers,<br>The Hexlink team</p>
                                                        </td>
                                                      </tr>
                                                  </table>
                                                </div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="height:40px;">&nbsp;</td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:20px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="text-align:center;">
                                      <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>dev.hexlink.io</strong> </p>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:80px;">&nbsp;</td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              <!--/100% body table-->
          </body>
        </html>`,
  };
}

export function buildNotifyTransferSmsMessage(
    sender: string,
    token: Token,
    sendAmount: string
) : string {
  return `${sender} sends you ${sendAmount} ${token.symbol}!`;
}

export function buildSmsOtpMessage(otp: string) : string {
  return `Your Hexlink verification code is ${otp}, do not share it with anyone.`;
}
