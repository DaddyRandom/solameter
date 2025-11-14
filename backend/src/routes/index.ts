import { Router } from 'express';
import { getCurrentGaugeData, getTrendingTokens, getBaselineInfo } from '../services/aggregator';

const router = Router();

/**
 * GET /api/v1/current
 * Returns current gauge reading and volume data
 */
router.get('/current', async (req, res, next) => {
  try {
    const data = await getCurrentGaugeData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/trending
 * Returns top trending meme coins
 */
router.get('/trending', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const tokens = await getTrendingTokens(limit);
    res.json({ tokens });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/baseline
 * Returns baseline configuration
 */
router.get('/baseline', async (req, res, next) => {
  try {
    const info = getBaselineInfo();
    res.json(info);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/stats
 * Returns overall statistics
 */
router.get('/stats', async (req, res, next) => {
  try {
    const gaugeData = await getCurrentGaugeData();
    const trending = await getTrendingTokens(5);

    res.json({
      current: gaugeData,
      topTokens: trending,
      baseline: getBaselineInfo(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
