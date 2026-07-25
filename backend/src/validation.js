const { z } = require('zod');

// Wraps a Zod schema into Express middleware. On failure, returns a 400
// with the first validation issue in plain English instead of a raw
// Zod error object — friendlier for the mobile app to display directly.
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const field = firstIssue.path.join('.') || 'body';
      return res.status(400).json({ error: `${field}: ${firstIssue.message}` });
    }
    req.body = result.data;
    next();
  };
}

const schemas = {
  register: z.object({
    name: z.string().trim().min(1, 'is required').max(80),
    email: z.string().trim().email('must be a valid email'),
    password: z.string().min(6, 'must be at least 6 characters'),
  }),

  login: z.object({
    email: z.string().trim().email('must be a valid email'),
    password: z.string().min(1, 'is required'),
  }),

  createDeck: z.object({
    title: z.string().trim().min(1, 'is required').max(120),
    subject: z.string().trim().min(1, 'is required').max(60),
    description: z.string().trim().max(500).optional(),
    color: z.string().trim().optional(),
  }),

  updateDeck: z.object({
    title: z.string().trim().min(1).max(120).optional(),
    subject: z.string().trim().min(1).max(60).optional(),
    description: z.string().trim().max(500).optional(),
    color: z.string().trim().optional(),
    isPublic: z.boolean().optional(),
  }),

  card: z.object({
    question: z.string().trim().min(1, 'is required').max(500),
    answer: z.string().trim().min(1, 'is required').max(500),
    hint: z.string().trim().max(200).optional(),
  }),

  cardReview: z.object({
    correct: z.boolean(),
  }),

  createDuel: z.object({
    deckId: z.string().trim().min(1, 'is required'),
    mode: z.enum(['async', 'live']).optional(),
    secondsPerCard: z.number().int().min(3).max(120).optional(),
  }),

  submitDuel: z.object({
    answers: z
      .array(
        z.object({
          cardId: z.string().trim().min(1),
          correct: z.boolean(),
          responseTimeMs: z.number().nonnegative(),
        })
      )
      .default([]),
  }),
};

module.exports = { validateBody, schemas };
