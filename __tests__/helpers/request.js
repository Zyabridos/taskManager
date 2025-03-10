export default async function request(app, method, url, cookie, payload = null) {
  return app.inject({
    method,
    url,
    cookies: cookie,
    ...(payload && { payload: { data: payload } }),
  });
}
