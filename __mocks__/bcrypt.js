// __mocks__/bcrypt.js
export const hash = jest.fn();
export const compare = jest.fn();
export default { hash, compare };
