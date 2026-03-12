const { default: satori } = require("satori");
const { Resvg } = require("@resvg/resvg-js");
const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

async function main() {
  const fontData = readFileSync("/usr/share/fonts/truetype/lato/Lato-Regular.ttf");
  const fontDataBold = readFileSync("/usr/share/fonts/truetype/lato/Lato-Bold.ttf");

  const element = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#f2f2f2",
        fontFamily: "Roboto",
      },
      children: [
        // Header bar
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#929292",
              padding: "16px",
              height: "60px",
            },
            children: {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  letterSpacing: "4px",
                },
                children: "TUT - TEMPORIZADOR DE USO DE TELA",
              },
            },
          },
        },
        // About section
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px 50px",
              backgroundColor: "#f2f2f2",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: "16px",
                  },
                  children: "Sobre",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "18px",
                    color: "#333333",
                    textAlign: "center",
                    lineHeight: "1.6",
                    maxWidth: "800px",
                  },
                  children:
                    "O TuT – Temporizador de Uso de Tela, é um dispositivo IOT com a função de otimizar o tempo de uso de tela do usuário. Seu foco está em aumentar a concentração do usuário por meio de um timer baseado no método Pomodoro, na prevenção da saúde ao dar descansos eventuais para olhos e corpo.",
                },
              },
            ],
          },
        },
        // Features section (red)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#b80000",
              padding: "30px 40px",
              gap: "50px",
            },
            children: [
              ["25:00", "Método Pomodoro"],
              ["LED", "LED e Buzzer"],
              ["IoT", "Dados no ThingSpeak"],
              ["Web", "Página Web"],
            ].map(([icon, label]) => ({
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "#ffffff",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        border: "2px solid #ffffff",
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      },
                      children: icon,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { fontSize: "14px", textAlign: "center" },
                      children: label,
                    },
                  },
                ],
              },
            })),
          },
        },
        // Team section
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px",
              backgroundColor: "#f2f2f2",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: "12px",
                  },
                  children: "Projeto integrador realizado por",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: "24px",
                    fontSize: "16px",
                    color: "#333333",
                  },
                  children: [
                    {
                      type: "div",
                      props: { children: "Danielli Borges" },
                    },
                    {
                      type: "div",
                      props: { children: "•" },
                    },
                    {
                      type: "div",
                      props: { children: "Gabriel Vale" },
                    },
                    {
                      type: "div",
                      props: { children: "•" },
                    },
                    {
                      type: "div",
                      props: { children: "Jeferson Melo" },
                    },
                    {
                      type: "div",
                      props: { children: "•" },
                    },
                    {
                      type: "div",
                      props: { children: "Willian Neves" },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "14px",
                    color: "#666666",
                    marginTop: "8px",
                  },
                  children:
                    "FATEC Shunji Nishimura — Big Data no Agronegócio — 2023",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element, {
    width: 900,
    height: 500,
    fonts: [
      {
        name: "Roboto",
        data: fontData,
        weight: 400,
        style: "normal",
      },
      {
        name: "Roboto",
        data: fontDataBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 900,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outputPath = join(__dirname, "..", "Site", "preview.png");
  writeFileSync(outputPath, pngBuffer);
  console.log(`Preview image generated at: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error generating image:", err);
  process.exit(1);
});
