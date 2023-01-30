export async function obterDados(url: string) {
  const result = await fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((json) => json.data);

  return result;
}

export async function postarDados(url: string, corpo: string) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(corpo),
  });
  const json = await res.json();
  return json;
}

export async function atualizarDados(url: string, corpo: string) {
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(corpo),
  });
  const json = await res.json();
  return json;
}

export async function excluirDados(url: string) {
  const res = await fetch(url, {
    method: "DELETE",
  });
  const json = await res.json();
  return json;
}
