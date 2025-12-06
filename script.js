document.addEventListener("DOMContentLoaded", () => {
  const formPeminjaman = document.getElementById("formPeminjaman");
  const tabelData = document.getElementById("tabelData");
  const notification = document.getElementById("notification");

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type = "success") => {
    notification.textContent = message;
    notification.style.backgroundColor =
      type === "success" ? "var(--success-color)" : "var(--warning-color)";
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  };

  // Fungsi untuk mengambil data dari localStorage
  const ambilDataDariStorage = () => {
    const data = localStorage.getItem("dataPeminjaman");
    return data ? JSON.parse(data) : [];
  };

  // Fungsi untuk menyimpan data ke localStorage
  const simpanDataKeStorage = (data) => {
    localStorage.setItem("dataPeminjaman", JSON.stringify(data));
  };

  // Fungsi untuk menampilkan data di tabel
  const tampilkanData = () => {
    const dataPeminjaman = ambilDataDariStorage();
    tabelData.innerHTML = ""; // Kosongkan tabel terlebih dahulu

    if (dataPeminjaman.length === 0) {
      tabelData.innerHTML =
        '<tr><td colspan="8" style="text-align:center; padding: 20px;">Belum ada data peminjaman.</td></tr>';
      return;
    }

    dataPeminjaman.forEach((item, index) => {
      const baris = document.createElement("tr");

      // Format tanggal agar lebih mudah dibaca
      const waktu = new Date(item.waktuPeminjaman);
      const formattedWaktu = waktu.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Logika untuk menampilkan tombol/status
      let statusCell;
      if (item.status === "sudah_dikembalikan") {
        statusCell = `<span class="status-returned"><i class="fas fa-check-circle"></i> Sudah Dikembalikan</span>`;
      } else {
        statusCell = `<button class="btn-status" data-id="${item.id}"><i class="fas fa-clock"></i> Sedang Dipinjam</button>`;
      }

      baris.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.namaPeminjam}</td>
                <td>${item.guruPengampu}</td>
                <td>${item.kelas}</td>
                <td>${item.namaBarang}</td>
                <td>${item.jumlah}</td>
                <td>${formattedWaktu}</td>
                <td>${statusCell}</td>
            `;
      tabelData.appendChild(baris);
    });
  };

  // Fungsi untuk menangani pengiriman form
  formPeminjaman.addEventListener("submit", (event) => {
    event.preventDefault(); // Mencegah halaman reload

    // Ambil nilai dari form
    const dataBaru = {
      id: Date.now(), // ID unik berdasarkan waktu
      namaPeminjam: document.getElementById("namaPeminjam").value,
      guruPengampu: document.getElementById("guruPengampu").value,
      kelas: document.getElementById("kelas").value,
      namaBarang: document.getElementById("namaBarang").value,
      jumlah: document.getElementById("jumlah").value,
      waktuPeminjaman: document.getElementById("waktuPeminjaman").value,
      status: "sedang_dipinjam", // Status default saat pertama kali dipinjam
    };

    // Ambil data lama, tambahkan data baru
    const dataPeminjaman = ambilDataDariStorage();
    dataPeminjaman.push(dataBaru);

    // Simpan kembali ke localStorage
    simpanDataKeStorage(dataPeminjaman);

    // Reset form
    formPeminjaman.reset();

    // Tampilkan ulang data di tabel
    tampilkanData();

    // Tampilkan notifikasi sukses
    showNotification("Data peminjaman berhasil ditambahkan!");
  });

  // Fungsi untuk menangani klik tombol status
  tabelData.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-status");
    if (btn) {
      const idToUpdate = parseInt(btn.getAttribute("data-id"));

      let dataPeminjaman = ambilDataDariStorage();
      // Cari item yang akan di-update statusnya
      const itemIndex = dataPeminjaman.findIndex(
        (item) => item.id === idToUpdate
      );

      if (itemIndex !== -1) {
        // Ubah status
        dataPeminjaman[itemIndex].status = "sudah_dikembalikan";

        // Simpan perubahan
        simpanDataKeStorage(dataPeminjaman);

        // Tampilkan ulang tabel
        tampilkanData();

        // Tampilkan notifikasi
        showNotification("Status berhasil diperbarui: Sudah Dikembalikan.");
      }
    }
  });

  // Tampilkan data saat halaman pertama kali dimuat
  tampilkanData();
});
