// src/controllers/statistic/statistic.controller.js
import * as statisticService from '../../services/statistic/statistic.service.js';
import { successResponse, errorResponse } from '../../helpers/index.js';

export const getStatistics = async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return errorResponse(req, res, 'startDate and endDate are required', 400);
  }
  try {
    const stats = await statisticService.getStatistics(startDate, endDate);
    return successResponse(req, res, stats);
  } catch (err) {
    return errorResponse(req, res, err.message);
  }
};
