export async function checkResponseCode(
  app,
  method,
  url,
  cookie = null,
  payload = null,
  expectedStatus = 200,
) {
  const response = await app.inject({
    method,
    url,
    ...(payload && { payload: { data: payload } }),
    ...(cookie && { cookies: cookie }),
  });
  console.log(
    `Response from ${method} ${url}:`,
    response.statusCode,
    response.body,
  );

  expect(response.statusCode).toBe(expectedStatus);
  return response;
}

export const findEntity = async (model, fieldName, value) => model.query().findOne({ [fieldName]: value });
