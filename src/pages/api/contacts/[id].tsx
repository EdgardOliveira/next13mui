import prisma from "@/libs/db/Db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Contacts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "DELETE":
      deleteById(req, res);
      break;
    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Método: ${method} não é permitido para esta rota`);
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({
        sucess: false,
        mensage: "É necessário fornecer um id",
        data: [],
        error: "Não foi fornecido um id",
      });
    }

    const results = await prisma.contact.delete({
      where: {
        id: Number(id),
      },
    });

    if (results) {
      return res.status(200).json({
        sucess: true,
        mensage: "Registro excluído com sucesso",
        data: results,
        error: "",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(404).json({
        sucess: false,
        mensage: "Não conseguimos excluir o registro",
        data: [],
        error: e.message,
      });
    }
  }
}
