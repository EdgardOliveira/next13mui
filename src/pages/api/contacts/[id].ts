import prisma from "@/libs/db/Db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Contacts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      console.log(`GET getById`);
      getById(req, res);
      break;
    case "DELETE":
      deleteById(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Método: ${method} não é permitido para esta rota`);
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "É necessário fornecer um id",
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
        success: true,
        message: "Registro excluído com sucesso",
        data: results,
        error: "",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Nenhum resultado encontrado",
        data: [],
        error: "Não encontramos o registro para ser excluído",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(404).json({
        success: false,
        message: "Não conseguimos excluir o registro",
        data: [],
        error: e.message,
      });
    }
  }
}

async function getById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log(`getById API: ${id}`);
  try {
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "É necessário fornecer um id",
        data: [],
        error: "Não foi fornecido um id",
      });
    }

    console.log(`getDataById API consultando o id: ${id}`);

    const results = await prisma.contact.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (results) {
      return res.status(200).json({
        success: true,
        message: "Registro consultado com sucesso",
        data: results,
        error: "",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Nenhum resultado encontrado",
        data: [],
        error: "Não encontramos o registro para ser exibido",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(404).json({
        success: false,
        message: "Não conseguimos consultar o registro",
        data: [],
        error: e.message,
      });
    }
  }
}
