import prisma from "@/libs/db/Db";
import { NextApiRequest, NextApiResponse } from "next";

export interface IContactsProps {
  id: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  registrarId: number;
}

export interface IResultsProps {
  success: boolean;
  message: string;
  data?: IContactsProps[];
  error?: string;
}

export default async function Contacts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      getAll(req, res);
      break;
    case "POST":
      create(req, res);
      break;
    default:
      res
        .status(405)
        .setHeader("Allow", ["GET", "POST"])
        .json({
          success: false,
          message: `Método: ${method} não é permitido para esta rota`,
          data: [],
          error: `Método: ${method} não é permitido para esta rota`,
        });
  }
}

async function create(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contact = req.body;

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "É necessário dados para cadastrar",
        data: [],
        error: "Não foram fornecidos dados para cadastrar",
      });
    }

    const result = await prisma.contact.findFirst({
      where: {
        name: contact.email,
      },
    });

    if (!result) {
      const createdContact = await prisma.contact.create({ data: contact });

      return res.status(201).json({
        success: true,
        message: "Dados cadastrados com sucesso!",
        data: createdContact,
        error: "",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Dados já existem!",
        data: [],
        error: "Os dados já existem!",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Ocorreu um erro ao tentar cadastrar",
        data: [],
        error: e.message,
      });
    }
  }
}

async function getAll(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await prisma.contact.findMany();

    return res.status(200).json({
      success: true,
      message: "Consulta de dados realizada com sucesso",
      data: results,
      error: "",
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Não conseguimos realizar a consulta dos dados",
        data: [],
        error: e.message,
      });
    }
  }
}
