const btn_copy_nf = document.getElementById('copy-nf');
const btn_donwload_nf = document.getElementById('download-nf');

function coletar_notafiscal(args) {
    console.log('coletar_notafiscal ' + args);
    if (/www4\.fazenda\.\w\w\.gov\.br/.test(window.location.hostname)) {
        const notafiscal_campos = ['nome', 'data', 'cnpj', 'endereco', 'qtd_itens', 'valor_total', 'desconto', 'valor_descontado', 'trubutos_totais', 'forma_pagamento', 'tipo_emissao', 'numero', 'serie', 'emissao', 'protocolo_autorizacao', 'ambiente_producao', 'chave', 'infos_extra'];
        const sep = ';';

        const informacoes_gerais = document.querySelector("#infos > div:nth-child(1) > div > ul > li").innerText;
        let data_json = {
            nome: document.querySelector("#u20").innerText,
            cnpj: document.querySelector("#conteudo > div.txtCenter > div:nth-child(2)").innerText.replace('CNPJ: ', ''),
            endereco: document.querySelector("#conteudo > div.txtCenter > div:nth-child(3)").innerText,
            ...Object.fromEntries([...document.querySelectorAll("#linhaTotal")].map(el => {
                    if (el.querySelector('label')) {
                        const content = el.querySelector('span').innerText || '';
                        let label = el.querySelector('label').innerText || '';
                        if (label === 'Qtd. total de itens:')
                            label = 'qtd_itens';
                        else if (label === 'Valor total R$:')
                            label = 'valor_total';
                        else if (label === 'Descontos R$:')
                            label = 'desconto';
                        else if (label === 'Valor a pagar R$:')
                            label = 'valor_descontado';
                        else if (label.startsWith('Informação dos Tributos Totais Incidentes'))
                            label = 'trubutos_totais';
                        else
                            label = '';
                        return [label, content.replace(',', '.')];
                    }
                })
                .filter(e => e !== undefined)
                .filter(e => e[0] !== '')
            ),
            forma_pagamento: document.querySelector('.tx').innerText,
            tipo_emissao: document.querySelector("#infos > div:nth-child(1) > div > ul > li > strong:nth-child(1)").innerText,
            numero: informacoes_gerais.match(/Número: (\d+)/)[1],
            serie: informacoes_gerais.match(/Série: (\d+)/)[1],
            data: informacoes_gerais.match(/Emissão: (\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/)[1].replace('\n', ''),
            emissao: informacoes_gerais.match(/Emissão: ([\w\d\s/:-]+)\n/)[1].replace('\n', ''),
            protocolo_autorizacao: informacoes_gerais.match(/Protocolo de Autorização: ([\w\d\s/:-à]+)/)[1],
            ambiente_producao: informacoes_gerais.match(/Ambiente de Produção (.*[\w\d\s/:-à]+)/)[1],
            chave: document.querySelector('.chave').innerText,
            ... { infos_extra: document.querySelector("#infos > div:nth-child(4) > div > ul > li") ? document.querySelector("#infos > div:nth-child(4) > div > ul > li").innerText : '' }
        };
        let data_csv = notafiscal_campos.map(key => data_json.hasOwnProperty(key) ? String(data_json[key]).replace(sep, ',') : '').join(sep);
        if (args === 'copiar') {
            window.prompt("Use 'Ctrl+C, Enter' para copiar", data_csv);
        } else if (args === 'baixar') {
            data_csv = notafiscal_campos.join(sep) + '\n' + data_csv;
            data_csv = "data:text/csv;charset=utf-8," + data_csv;
            var encodedUri = encodeURI(data_csv);
            window.open(encodedUri);
        }
    } else {
        alert("Página inválida, deve ser www4.fazenda.xx.gov.br");
    }
}

btn_copy_nf.onclick = async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: coletar_notafiscal,
        args: ['copiar']
    });
};

btn_donwload_nf.onclick = async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: coletar_notafiscal,
        args: ['baixar']
    });
};