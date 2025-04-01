export const clickLinkByName = async (page, name) => {
  await page.getByRole('link', { name }).click();
};

export const clickButtonByName = async (page, name) => {
  await page.getByRole('button', { name }).click();
};
