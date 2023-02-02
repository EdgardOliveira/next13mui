import prisma from "@/libs/db/Db";
import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";

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
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Método: ${method} não é permitido para esta rota`);
  }
}

async function getAll(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await prisma.contact.findMany();

    console.log(results);

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
