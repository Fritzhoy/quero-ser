const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileOne = fs.createReadStream("../Caso de teste 2/c2_produtos.txt");
  const fileTwo = fs.createReadStream("../Caso de teste 2/c2_vendas.txt");

  //Nele constarão casos que são divergentes. Para cada divergência deve-se gravar o número da linha do arquivo e a mensagem conforme descrito na tabela a seguir
  const divergencia = [];

  /**
   * Criação de objeto a partir da leitura arquivo produtos.txt;
   */

  const rlOne = readline.createInterface({
    input: fileOne,
    crlDelay: Infinity,
  });

  let headersProduto = ["Produto", "QtCO", "QtMin"];
  const dataProduto = [];

  for await (const line of rlOne) {
    const row = line.split(/;/);
    const entry = {};
    for (let i = 0; i < row.length; i++) {
      const header = headersProduto[i];
      const cell = row[i];
      entry[header] = header === "Data" ? cell : Number(cell);
    }

    dataProduto.push(entry);
  }

  /**
   * Criação de objeto a partir da leitura arquivo Vendas.txt;
   */
  const rlTwo = readline.createInterface({
    input: fileTwo,
    crlDelay: Infinity,
  });

  let headersVendas = ["Produto", "QtVendas", "SV", "Canal"];
  const dataVendas = [];
  let linha = 0;

  for await (const line of rlTwo) {
    linha++;
    const row = line.split(/;/);
    const entryTwo = {};
    for (let i = 0; i < row.length; i++) {
      const header = headersVendas[i];
      const cell = row[i];
      entryTwo[header] = header === "Data" ? cell : Number(cell);
    }
      if (entryTwo.SV === 100 || entryTwo.SV === 102) {
        dataVendas.push(entryTwo);
      } else if (entryTwo.SV === 135) {
        divergencia.push(linha, "Venda Cancelada");
      } else if (entryTwo.SV === 190) {
        divergencia.push(linha, "Venda não finalizada");
      } else if (entryTwo.SV === 999) {
        divergencia.push(linha, "Error Desconhecido. Acionar equipe de TI");
      }
  }
  console.log(divergencia);

  //Vendas por Canal
  const canal = dataVendas.reduce((acc, { Canal, QtVendas }) => {
    acc[Canal] = acc[Canal] || { Canal, QtVendas: 0 };
    acc[Canal].QtVendas += QtVendas;
    return acc;
  }, {});

  const canalOutput = Object.values(canal);
  console.log(canalOutput);

  //Soma de Vendas
  const sumVendas = dataVendas.reduce((acc, { Produto, QtVendas }) => {
    acc[Produto] = acc[Produto] || { Produto, QtVendas: 0 };
    acc[Produto].QtVendas += QtVendas;
    return acc;
  }, {});

  const qtVendas = Object.values(sumVendas);
  console.log(qtVendas);
  //console.log(dataProduto, dataVendas);

}

processLineByLine();
