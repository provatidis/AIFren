import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui'; // Get API key from environment variable
import OpenAI from 'openai';

const apiKey = '';
// import 'dotenv/config';

// const apiKey: string = process.env.REACT_APP_OPENAI_API_KEY ?? 'Error';
// const apiKey = snap;

const openai = new OpenAI({ apiKey });

/**
 *
 * @param message
 */
async function talk(message: string) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: message }],
    model: 'gpt-3.5-turbo',
  });

  // return JSON.stringify(completion.choices[0]);
  return completion.choices[0];
}

/**
 *
 * @param x
 * @param apiKey
 * @param address
 * @param x.origin
 * @param x.request
 */
// const setSnapState = async (apiKey: string) => {
//   return snap.request({
//     method: 'snap_manageState',
//     params: {
//       operation: 'update',
//       newState: {
//         apiKey,
//       },
//     },
//   });
// };
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  // console.log(res);
  switch (request.method) {
    case 'hello':
      // console.log(res);
      // eslint-disable-next-line no-case-declarations
      const prompt: string = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            // heading('What do you want to ask Fren?'),
            text('Please enter the crypto concept you want'),
          ]),
          placeholder: 'AMMs, Oracles etc',
        },
      });
      const result = await talk(
        `You are a crypto expert/teacher. Please explain the DeFi/crypto concept: ${prompt}. Less than 30 words`,
      );
      const message: string = result?.message.content ?? 'Error';
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`**${message}**`), // Displaying the response from OpenAI

            // text('This custom confirmation is just for display purposes.'),
            // text(
            //   'But you can edit the snap source code to make it do something, if you want to!',
            // ),
          ]),
        },
      });
    // case 'set_snap_state':
    //   if (
    //     request.params &&
    //     'apiKey' in request.params &&
    //     typeof request.params.apiKey === 'string'
    //   ) {
    //     await setSnapState(request.params.apiKey);
    //     return true;
    //   }
    // eslint-disable-next-line no-fallthrough
    default:
      throw new Error('Method not found.');
  }
};
