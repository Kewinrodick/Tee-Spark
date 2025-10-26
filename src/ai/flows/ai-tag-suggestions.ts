'use server';

/**
 * @fileOverview Provides AI-powered tag suggestions for design uploads.
 *
 * - `suggestTags`:  A function that takes a design description and returns a list of suggested tags.
 * - `SuggestTagsInput`: The input type for the suggestTags function (design description).
 * - `SuggestTagsOutput`: The return type for the suggestTags function (list of tags).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  designDescription: z
    .string()
    .describe('The description of the design for which tags are to be suggested.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the design.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an expert in generating relevant tags for design uploads on a T-shirt design selling platform.

  Given the following design description, suggest 5-10 relevant tags that would help users discover the design.

  Design Description: {{{designDescription}}}

  The tags should be comma separated, and each tag should be a single word or short phrase.

  Example Output:
  tag1, tag2, tag3, tag4, tag5
  `,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
