class QRCodeGenerator {
  constructor(container, qrCodeBtn, qrCodeInput, qrCodeImg) {
    this.container = container;
    this.qrCodeBtn = qrCodeBtn;
    this.qrCodeInput = qrCodeInput;
    this.qrCodeImg = qrCodeImg;
    this.qrCodeGenerated = false;
  }

  generate() {
    const qrCodeInputValue = this.qrCodeInput.value;

    if (!qrCodeInputValue) return;

    this.qrCodeBtn.innerText = "Gerando código...";

    setTimeout(() => {
      this.qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeInputValue}`;
    }, 100);

    this.qrCodeImg.onload = async () => {
      this.container.classList.add("active");
      this.qrCodeBtn.innerText = "QR Code gerado! 😀";
      this.qrCodeGenerated = true;
      localStorage.setItem('qrCodeImage', this.qrCodeImg.src);
      await this.updateProcess();
    };
  }

  async updateProcess() {
    const processName = "qrCode";
    try {
      const response = await fetch(
        `http://localhost:4000/process/${processName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
}

const container = document.querySelector(".container");
const qrCodeBtn = document.querySelector("#qr-form button");
const qrCodeInput = document.querySelector("#qr-form input");
const qrCodeImg = document.querySelector("#qr-code img");

const qrCodeGenerator = new QRCodeGenerator(container, qrCodeBtn, qrCodeInput, qrCodeImg);

qrCodeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  qrCodeGenerator.generate();
});

qrCodeInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    qrCodeGenerator.generate();
  }
});

qrCodeInput.addEventListener("keyup", () => {
  if (!qrCodeInput.value && !qrCodeGenerator.qrCodeGenerated) {
    container.classList.remove("active");
    qrCodeBtn.innerText = "Gerar QR Code";
    qrCodeImg.src = "";
  }
  qrCodeGenerator.qrCodeGenerated = false;
});

window.onload = () => {
  const storedQrCodeImage = localStorage.getItem('qrCodeImage');
  if (storedQrCodeImage) {
    qrCodeImg.src = storedQrCodeImage;
    container.classList.add("active");
    qrCodeBtn.innerText = "QR Code gerado! 😀";
  }
};