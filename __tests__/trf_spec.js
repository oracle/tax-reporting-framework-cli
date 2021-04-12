jest.mock('inquirer');

const { prompt, expectPrompts } = require('inquirer');

it('should pass', async () => {
  // specify expected prompts and corresponding actions
  // before making the prompt
  expectPrompts([
    {
      message: 'Hello',
      choices: ['Foo', 'Bar'],
      check: [0, 1]
    },
    {
      message: 'World',
      choices: ['Baz', 'Qux'],
      choose: 0
    },
    {
      message: 'Really ok?',
      confirm: true
    }
  ]);

  // then just use inquirer as normal.
  // if a imported mdoule uses inquirer, it's also using the mocked version.
  const answers = await prompt([
    {
      name: 'hello',
      message: 'Hello with some extra text',
      type: 'checkbox',
      choices: [
        { name: 'Foo', value: 'foo' },
        { name: 'Bar', value: 'bar' }
      ]
    },
    {
      name: 'world',
      message: 'World',
      type: 'list',
      choices: [
        { name: 'Baz', value: 'baz' },
        { name: 'Qux', value: 'qux' }
      ]
    },
    {
      name: 'ok',
      message: 'Really ok?',
      type: 'confirm'
    }
  ]);

  expect(answers).toEqual({
    hello: ['foo', 'bar'],
    world: 'baz',
    ok: true
  });
});
