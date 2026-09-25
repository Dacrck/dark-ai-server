const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors({
  origin: [
    "https://darck-ia.web.app",
    "https://darck-ia.firebaseapp.com",
    "null"
  ]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    mensaje: "Servidor de Dark AI funcionando"
  });
});

app.get("/imagekit-auth", (req, res) => {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({
        error: "IMAGEKIT_PRIVATE_KEY no está configurada"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 30 * 60;

    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    res.json({
      token,
      expire,
      signature
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo generar la autenticación"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Dark AI Server ejecutándose en puerto ${PORT}`);
});
