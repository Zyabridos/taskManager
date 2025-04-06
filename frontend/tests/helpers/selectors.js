export const clickLinkByName = async (page, name) => {
  await page.getByRole('link', { name }).click();
};

export const clickButtonByName = async (page, name) => {
  await page.getByRole('button', { name }).click();
};

export async function fillFilterSelect(page, labelText, optionText) {
  const label = await page.getByLabel(labelText);
  await label.selectOption({ label: optionText });
}
