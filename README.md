# url-shortner

## API Project: URL Shortener API

### User Stories

1. It can POST a URL to `https://prong-justice.glitch.me/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If an invalid URL is passed that doesn't follow the `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like {"error":"invalid URL"}
NOTE: the submitted url is considered valid site if it passes the function dns.lookup(host, cb) from the dns core module.
3. If API is hit with shortened URL, it will be redirected to the original link.
4. The provided Short URL will be a counter which will get increased by one each time it is given to a particular url.


#### Creation Example:

POST https://prong-justice.glitch.me/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

https://prong-justice.glitch.me/api/shorturl/1

#### Will redirect to:

https://www.google.com