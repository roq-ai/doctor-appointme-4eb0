import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { insurancePlanValidationSchema } from 'validationSchema/insurance-plans';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.insurance_plan
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getInsurancePlanById();
    case 'PUT':
      return updateInsurancePlanById();
    case 'DELETE':
      return deleteInsurancePlanById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInsurancePlanById() {
    const data = await prisma.insurance_plan.findFirst(convertQueryToPrismaUtil(req.query, 'insurance_plan'));
    return res.status(200).json(data);
  }

  async function updateInsurancePlanById() {
    await insurancePlanValidationSchema.validate(req.body);
    const data = await prisma.insurance_plan.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteInsurancePlanById() {
    const data = await prisma.insurance_plan.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
