import { Flashcard, TheoryLesson } from '../types/biology';

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    id: 'bai-1-gen-va-tai-ban-dna',
    code: 'BÀI 1',
    title: 'GEN VÀ SỰ TÁI BẢN DNA',
    subtitle: 'Chức năng của DNA · Khái niệm, cấu trúc và phân loại gene · Cơ chế tái bản DNA',
    sourceInfo: 'Trích xuất nguyên bản từ ilovepdf_merged.pdf (Trang 1 – 9) và Đề ôn tập 1 – 5',
    isDirectFromPdf1Heading: true,
    summary:
      'DNA là vật chất di truyền ở hầu hết sinh vật, thực hiện 4 chức năng cốt lõi: mang, bảo quản, truyền đạt, biểu hiện thông tin di truyền và tạo biến dị. Gene là một đoạn trình tự nucleotide trên DNA mã hóa RNA hoặc chuỗi polypeptide, gồm 3 vùng (điều hòa, mã hóa, kết thúc). Quá trình tái bản DNA diễn ra theo nguyên tắc bổ sung và nguyên tắc bán bảo toàn nhờ hệ thống enzyme chuyên biệt.',
    keywords: [
      'Nucleotide (A, T, G, C)',
      'Liên kết phosphodiester',
      'Liên kết hydrogen (A=T: 2, G≡C: 3)',
      'Vùng điều hòa (Promoter)',
      'Vùng mã hóa (Exon / Intron)',
      'Vùng kết thúc',
      'Gene cấu trúc & Gene điều hòa',
      'Gene phân mảnh & Không phân mảnh',
      'Nguyên tắc bổ sung & Bán bảo toàn',
      'DNA polymerase (chiều 5’ → 3’)',
      'Đoạn Okazaki & DNA ligase',
    ],
    sections: [
      {
        id: 'b1-sec1',
        title: 'I. CHỨC NĂNG CỦA DNA',
        content: [
          '1. Mang thông tin di truyền: Thành phần, số lượng và trật tự sắp xếp các đơn phân nucleotide trên mạch đơn DNA là thông tin di truyền quyết định tính đặc thù của cá thể. Các liên kết hóa học (liên kết cộng hóa trị phosphodiester bền vững trên mỗi mạch và liên kết hydrogen giữa hai mạch) giúp DNA bền vững, bảo quản thông tin di truyền ổn định.',
          '2. Truyền thông tin di truyền: Nucleotide trên hai mạch đơn DNA liên kết nhau bằng liên kết hydrogen theo nguyên tắc bổ sung (A liên kết với T bằng 2 liên kết hydrogen, G liên kết với C bằng 3 liên kết hydrogen). Liên kết này yếu, có thể tách nhau trong quá trình tái bản DNA để tạo thành hai mạch khuôn; khi đó các nucleotide mới kết cặp với các nucleotide mạch khuôn theo nguyên tắc bổ sung. Nhờ tái bản, DNA truyền thông tin di truyền qua các thế hệ tế bào và cơ thể.',
          '3. Biểu hiện thông tin di truyền: Trình tự nucleotide của DNA biểu hiện thành trình tự nucleotide của RNA (qua phiên mã), từ đó quy định trình tự amino acid của protein (qua dịch mã) → DNA có chức năng biểu hiện thông tin di truyền thành tính trạng.',
          '4. Tạo biến dị: Trình tự nucleotide của DNA có khả năng biến đổi (đột biến) dẫn đến sự thay đổi thông tin di truyền, tạo biến dị. Biến dị di truyền là nguyên liệu sơ cấp của chọn lọc tự nhiên và tiến hóa.',
        ],
        keyTerms: [
          {
            term: 'Đơn phân của DNA (Nucleotide)',
            definition:
              'Gồm 3 thành phần: đường 5 carbon deoxyribose (C5H10O4), nhóm phosphate và 1 trong 4 loại nitrogenous base: Adenine (A), Thymine (T), Guanine (G), Cytosine (C).',
          },
          {
            term: 'Liên kết phosphodiester',
            definition:
              'Liên kết cộng hóa trị bền vững nối giữa các nucleotide trên cùng một chuỗi polynucleotide (hình thành khung đường – phosphate).',
          },
          {
            term: 'Nguyên tắc bổ sung (NTBS) trong DNA mạch kép',
            definition:
              'A của mạch này liên kết với T của mạch kia bằng 2 liên kết hydrogen; G của mạch này liên kết với C của mạch kia bằng 3 liên kết hydrogen. Hệ quả: A = T, G = C, A + G = T + C = 50%N, H = 2A + 3G.',
          },
        ],
        figures: [
          {
            id: 'doc1_p01_fig01',
            url: '/pdf-figures/doc1_p01_fig01.png',
            caption: 'Hình 1.1. Cấu trúc hoá học của DNA (ilovepdf_merged.pdf – Trang 1 & Trang 6)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 1,
          },
          {
            id: 'doc1_p04_fig04',
            url: '/pdf-figures/doc1_p04_fig04.jpg',
            caption: 'Sơ đồ chi tiết các liên kết hóa học (1, 2, 3, 4) và thành phần X, Y, Z trong phân tử DNA (Trang 4 – Câu 26)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 4,
          },
        ],
        misconceptions: [
          {
            myth: 'Các nucleotide trên hai mạch đơn của DNA liên kết với nhau bằng liên kết cộng hóa trị bền vững.',
            truth:
              'Sai. Giữa hai mạch đơn là liên kết hydrogen (liên kết yếu, dễ tách khi tái bản/phiên mã, nhưng số lượng lớn giúp phân tử DNA xoắn kép ổn định). Liên kết cộng hóa trị phosphodiester là liên kết dọc theo từng mạch đơn.',
          },
          {
            myth: 'Trên mỗi mạch đơn polynucleotide luôn có số lượng A = T và G = C.',
            truth:
              'Sai. Tỉ lệ A = T và G = C chỉ luôn đúng cho phân tử DNA mạch kép hoàn chỉnh (vì A1 = T2, T1 = A2 nên A = A1 + A2 = T1 + T2 = T). Trên 1 mạch đơn, A1 không nhất thiết bằng T1.',
          },
        ],
      },
      {
        id: 'b1-sec2',
        title: 'II. KHÁI NIỆM, CẤU TRÚC VÀ PHÂN LOẠI GENE',
        content: [
          'Khái niệm: Gene là đoạn trình tự nucleotide trên DNA mang thông tin di truyền mã hóa RNA hoặc chuỗi polypeptide.',
          'Cấu trúc của 1 gene điển hình gồm 3 vùng trình tự nucleotide (tính theo chiều 3’ → 5’ của mạch mã gốc):',
          '• Vùng điều hòa (nằm ở đầu 3’ của mạch mã gốc): Có trình tự khởi động (promoter) tổng hợp RNA giúp enzyme RNA polymerase nhận biết và liên kết → điều hòa lượng sản phẩm của gene.',
          '• Vùng mã hóa (nằm ở giữa gene): Chứa thông tin di truyền quy định trình tự RNA hoặc chuỗi polypeptide.',
          '• Vùng kết thúc (nằm ở đầu 5’ của mạch mã gốc): Mang tín hiệu kết thúc quá trình tổng hợp RNA (phiên mã).',
          'Phân loại gene:',
          '• Dựa vào chức năng: Chia thành Gene cấu trúc (mã hóa protein hình thành cấu trúc hoặc thực hiện chức năng tế bào nhưng không có chức năng điều hòa) và Gene điều hòa (mã hóa protein có chức năng điều hòa hoạt động của gene cấu trúc).',
          '• Dựa vào cấu trúc vùng mã hóa: Chia thành Gene không phân mảnh (vùng mã hóa liên tục, chỉ có trình tự được dịch mã, phổ biến ở sinh vật nhân sơ) và Gene phân mảnh (vùng mã hóa gồm các đoạn trình tự được dịch mã gọi là exon xen kẽ các đoạn không được dịch mã gọi là intron; có ở sinh vật nhân thực và một số ít vi sinh vật cổ). Quy tắc số đoạn: Nếu có n đoạn intron thì có (n + 1) đoạn exon xen kẽ.',
        ],
        comparisonTable: {
          title: 'Bảng so sánh Gene ở sinh vật nhân sơ và sinh vật nhân thực',
          headers: ['Tiêu chí', 'Gene không phân mảnh (Nhân sơ)', 'Gene phân mảnh (Nhân thực)'],
          rows: [
            ['Cấu trúc vùng mã hóa', 'Liên tục, không chứa đoạn intron', 'Không liên tục: các đoạn Exon (mã hóa) xen kẽ Intron (không mã hóa)'],
            ['Đối tượng đại diện', 'Vi khuẩn E. coli, vi khuẩn lam, xạ khuẩn', 'Nấm men, thực vật, động vật và một số ít vi sinh vật cổ'],
            ['Xử lý mRNA sau phiên mã', 'mRNA được trực tiếp dùng làm khuôn dịch mã ngay', 'Tiền mRNA phải cắt bỏ intron, nối các exon tạo mRNA trưởng thành'],
            ['Chiều dài gene (cùng số aa)', 'Ngắn hơn do không có các đoạn intron', 'Dài hơn do chứa thêm các đoạn intron không mã hóa amino acid'],
          ],
        },
        figures: [
          {
            id: 'doc1_p01_fig02',
            url: '/pdf-figures/doc1_p01_fig02.png',
            caption: 'Hình 1.2. Sơ đồ khái quát cấu trúc một gene ở sinh vật: nhân sơ (a) và nhân thực (b) (ilovepdf_merged.pdf – Trang 1)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 1,
          },
        ],
        misconceptions: [
          {
            myth: 'Vùng điều hòa nằm ở đầu 5’ của mạch mã gốc, vùng kết thúc nằm ở đầu 3’ của mạch mã gốc.',
            truth:
              'Cần lưu ý quy ước mạch: Mạch mã gốc (mạch khuôn) chạy theo chiều 3’ → 5’ (và mạch bổ sung/mã hóa chạy chiều 5’ → 3’). Tuy nhiên, trong một số câu hỏi trắc nghiệm sách cũ (như Câu 2, Câu 9, Câu 10 phần 1 trang 2–3 tài liệu), cần đọc kỹ từng phương án đối chiếu chức năng: Vùng điều hòa luôn khởi động/điều hòa phiên mã, còn vùng kết thúc luôn mang tín hiệu kết thúc phiên mã (không phải kết thúc dịch mã).',
          },
        ],
      },
      {
        id: 'b1-sec3',
        title: 'III. TÁI BẢN DNA (NHÂN ĐÔI DNA)',
        content: [
          'Khái niệm: Là quá trình tạo ra bản sao giống với phân tử DNA ban đầu, diễn ra ở kì trung gian của chu kì tế bào (chủ yếu trong nhân tế bào; ngoài ra còn diễn ra ở ti thể, lục lạp).',
          'Nguyên tắc thực hiện: Nguyên tắc bổ sung (A liên kết T, G liên kết C) và nguyên tắc bán bảo toàn (mỗi phân tử DNA con có 1 mạch từ DNA mẹ ban đầu và 1 mạch mới được tổng hợp từ nguyên liệu môi trường).',
          'Kết quả: Từ 1 phân tử DNA mẹ qua 1 lần tái bản tạo ra 2 phân tử DNA con giống hệt nhau và giống DNA mẹ. Sau k lần tái bản từ a phân tử DNA ban đầu: tạo ra a × 2^k phân tử DNA con, trong đó vẫn có 2a mạch cũ của mẹ và môi trường cung cấp N_mt = a × N × (2^k - 1) nucleotide tự do.',
        ],
        processSteps: [
          {
            stepNumber: 1,
            title: 'Bước 1: Tháo xoắn phân tử DNA',
            description:
              'Nhờ enzyme tháo xoắn (helicase) và topoisomerase, hai mạch đơn của phân tử DNA mẹ tách nhau dần tạo nên chạc chữ Y (chạc tái bản), để lộ hai mạch khuôn (một mạch khuôn có chiều 3’ → 5’ và một mạch khuôn có chiều 5’ → 3’). Enzyme RNA primase tổng hợp đoạn mồi RNA cung cấp đầu 3’-OH tự do.',
          },
          {
            stepNumber: 2,
            title: 'Bước 2: Tổng hợp các mạch DNA mới',
            description:
              'Enzyme DNA polymerase sử dụng hai mạch khuôn để tổng hợp mạch mới theo nguyên tắc bổ sung (A–T, G–C) và CHỈ tổng hợp mạch mới theo chiều 5’ → 3’. Do đó: trên mạch khuôn 3’ → 5’, mạch mới (mạch dẫn đầu) được tổng hợp liên tục hướng vào chạc tái bản; trên mạch khuôn 5’ → 3’, mạch mới (mạch ra chậm) được tổng hợp gián đoạn theo từng đoạn ngắn gọi là đoạn Okazaki ngược chiều mở chạc tái bản.',
          },
          {
            stepNumber: 3,
            title: 'Bước 3: Nối các đoạn Okazaki và hình thành 2 phân tử DNA con',
            description:
              'Các đoạn mồi RNA được loại bỏ và thay thế bằng các nucleotide DNA, sau đó enzyme DNA ligase nối các đoạn Okazaki lại với nhau tạo thành mạch ra chậm hoàn chỉnh. Kết thúc tạo ra 2 phân tử DNA con.',
          },
        ],
        figures: [
          {
            id: 'doc1_p02_fig03',
            url: '/pdf-figures/doc1_p02_fig03.png',
            caption: 'Hình 1.3. Tái bản DNA: một chạc tái bản (a); nguyên tắc bán bảo toàn (b) (ilovepdf_merged.pdf – Trang 2)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 2,
          },
          {
            id: 'doc1_p04_fig05',
            url: '/pdf-figures/doc1_p04_fig05.jpg',
            caption: 'Sơ đồ các enzyme tham gia tại chạc tái bản (Helicase, DNA primase, DNA polymerase, DNA ligase) (Trang 4 – Câu 28)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 4,
          },
          {
            id: 'doc1_p07_fig11',
            url: '/pdf-figures/doc1_p07_fig11.jpg',
            caption: 'So sánh tái bản DNA ở sinh vật nhân sơ (Hình 1 – 1 đơn vị tái bản trên DNA vòng) và nhân thực (Hình 2 – nhiều đơn vị tái bản trên DNA thẳng) (Trang 7 – Câu 6)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 7,
          },
          {
            id: 'doc1_p08_fig12',
            url: '/pdf-figures/doc1_p08_fig12.png',
            caption: 'Thí nghiệm kiểm chứng mô hình nhân đôi DNA bán bảo toàn bằng đồng vị phóng xạ N15 và N14 qua 5 thế hệ ở E. coli (Trang 8 – Câu 7)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 8,
          },
        ],
      },
    ],
    selfCheck: [
      {
        id: 'sc-b1-1',
        question: 'Vì sao trong quá trình tái bản DNA, một mạch mới được tổng hợp liên tục còn mạch kia được tổng hợp gián đoạn thành các đoạn Okazaki?',
        answer:
          'Vì hai mạch của phân tử DNA mẹ xoắn kép ngược chiều nhau (3’→5’ và 5’→3’), trong khi enzyme DNA polymerase chỉ có khả năng tổng hợp mạch mới theo một chiều duy nhất là 5’ → 3’.',
      },
      {
        id: 'sc-b1-2',
        question: 'Một gene ở sinh vật nhân thực có 51 đoạn exon và intron xen kẽ. Số đoạn exon và intron lần lượt là bao nhiêu?',
        answer:
          'Do hai đầu vùng mã hóa luôn là exon và xen kẽ giữa các exon là intron nên số đoạn exon nhiều hơn intron là 1. Vậy có 26 đoạn exon và 25 đoạn intron.',
      },
      {
        id: 'sc-b1-3',
        question: 'Nuôi 1 tế bào vi khuẩn E. coli chỉ chứa N15 sang môi trường chỉ có N14 qua 3 thế hệ (tạo 8 tế bào con). Có bao nhiêu phân tử DNA con chứa mạch N15?',
        answer:
          'Luôn có 2 phân tử DNA con chứa mạch N15 ban đầu (theo nguyên tắc bán bảo toàn, 2 mạch đơn N15 của phân tử DNA mẹ ban đầu được giữ nguyên trong 2 phân tử DNA con ở mọi thế hệ).',
      },
    ],
  },
  {
    id: 'bai-2-bieu-hien-thong-tin-di-truyen',
    code: 'BÀI 2',
    title: 'SỰ BIỂU HIỆN THÔNG TIN DI TRUYỀN',
    subtitle: 'Các loại RNA · Phiên mã & Phiên mã ngược · Mã di truyền · Dịch mã tổng hợp Protein',
    sourceInfo: 'Hệ thống hóa từ ilovepdf_merged.pdf (Trang 10 – 17) và Đề ôn tập 1 – 5',
    isDirectFromPdf1Heading: true,
    summary:
      'Thông tin di truyền trên DNA được biểu hiện thành tính trạng thông qua hai quá trình chính: Phiên mã (tổng hợp RNA từ mạch mã gốc 3’→5’ của gene nhờ enzyme RNA polymerase) và Dịch mã (tổng hợp chuỗi polypeptide từ khuôn mRNA tại ribosome với sự tham gia của tRNA). Mã di truyền là mã bộ ba (codon) đọc liên tục, không gối nhau theo chiều 5’→3’, mang tính đặc hiệu, tính thoái hóa và tính phổ biến.',
    keywords: [
      'mRNA, tRNA, rRNA',
      'Bộ ba mã hóa (Codon)',
      'Bộ ba đối mã (Anticodon)',
      'RNA polymerase',
      'Phiên mã ngược (Reverse transcriptase)',
      'cDNA',
      'Cắt bỏ intron – nối exon',
      'Mã mở đầu 5’AUG3’ (Met / fMet)',
      'Mã kết thúc (UAA, UAG, UGA)',
      'Polyribosome (Polysome)',
      'Liên kết peptide',
    ],
    sections: [
      {
        id: 'b2-sec1',
        title: 'I. CẤU TRÚC VÀ CHỨC NĂNG CÁC LOẠI RNA',
        content: [
          'RNA (Ribonucleic acid) được cấu tạo theo nguyên tắc đa phân từ 4 loại đơn phân ribonucleotide: Adenine (A), Uracil (U), Guanine (G) và Cytosine (C). Khác với DNA, đường cấu tạo RNA là ribose (C5H10O5) và thay Thymine (T) bằng Uracil (U).',
          '• mRNA (RNA thông tin): Cấu trúc mạch đơn, dạng thẳng; đóng vai trò trung gian truyền thông tin di truyền từ gene đến ribosome, làm khuôn trực tiếp cho quá trình dịch mã. Trên mRNA chứa các bộ ba mã hóa (codon).',
          '• tRNA (RNA vận chuyển): Cấu trúc 1 mạch polynucleotide nhưng cuộn xoắn lại ở một đầu tạo các thùy tròn, có những đoạn các cặp base liên kết bổ sung cục bộ (A–U, G–C) bằng liên kết hydrogen. Mỗi tRNA có một đầu gắn amino acid đặc hiệu và một thùy tròn mang bộ ba đối mã (anticodon) khớp bổ sung với codon trên mRNA (đóng vai trò như “người phiên dịch”).',
          '• rRNA (RNA ribosome): Mạch đơn nhưng có nhiều vùng xoắn cục bộ nhờ liên kết hydrogen; kết hợp với protein để cấu tạo nên ribosome (bào quan tổng hợp protein). Trong tế bào, rRNA có hàm lượng cao nhất do cấu trúc bền vững và tuổi thọ cao.',
        ],
        figures: [
          {
            id: 'doc1_p14_fig16',
            url: '/pdf-figures/doc1_p14_fig16.jpg',
            caption: 'Minh họa 3 loại RNA: (a) một đoạn mRNA; (b) tRNA; (c) rRNA (ilovepdf_merged.pdf – Trang 14)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 14,
          },
          {
            id: 'doc1_p10_fig13',
            url: '/pdf-figures/doc1_p10_fig13.jpg',
            caption: 'Cấu trúc chi tiết phân tử tRNA với vị trí gắn amino acid, liên kết hydrogen và bộ ba đối mã (Trang 10 – Câu 2)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 10,
          },
        ],
      },
      {
        id: 'b2-sec2',
        title: 'II. QUÁ TRÌNH PHIÊN MÃ VÀ PHIÊN MÃ NGƯỢC',
        content: [
          'Khái niệm phiên mã: Là quá trình tổng hợp phân tử RNA dựa trên mạch mã gốc (chiều 3’ → 5’) của gene theo nguyên tắc bổ sung (A gốc – U, T gốc – A, G gốc – C, C gốc – G).',
          'Đặc điểm của enzyme RNA polymerase: Vừa có khả năng tháo xoắn một đoạn DNA, vừa xúc tác kéo dài chuỗi polynucleotide RNA theo một chiều duy nhất 5’ → 3’ mà không cần đoạn mồi.',
          'Sự khác biệt giữa phiên mã ở nhân sơ và nhân thực:',
          '• Ở sinh vật nhân sơ: Không có màng nhân; mRNA sau phiên mã được trực tiếp dùng làm khuôn dịch mã ngay (thậm chí phiên mã và dịch mã diễn ra đồng thời khi đầu 5’ của mRNA vừa ló ra).',
          '• Ở sinh vật nhân thực: Phiên mã diễn ra chủ yếu trong nhân tế bào tạo ra tiền mRNA (mRNA sơ khai). Tiền mRNA phải được gắn mũ ở đầu 5’, cắt bỏ các đoạn intron, nối các đoạn exon lại với nhau và gắn đuôi poly-A ở đầu 3’ để tạo thành mRNA trưởng thành, rồi mới đi ra tế bào chất để dịch mã. Một mRNA sơ khai có thể được cắt nối các exon theo nhiều cách khác nhau tạo ra nhiều loại protein khác nhau từ 1 gene.',
          'Phiên mã ngược: Là quá trình tổng hợp mạch DNA bổ sung (cDNA) dựa trên khuôn mẫu RNA dưới tác dụng của enzyme phiên mã ngược (reverse transcriptase), sau đó tổng hợp mạch DNA thứ hai tạo phân tử cDNA mạch kép (gồm 4 loại nu A, T, G, C). Cần cho sự nhân lên của một số virus RNA (retrovirus) hoặc dùng trong công nghệ tạo cDNA.',
        ],
        processSteps: [
          {
            stepNumber: 1,
            title: 'Giai đoạn 1: Mở đầu phiên mã',
            description:
              'Enzyme RNA polymerase bám vào vùng điều hòa (trình tự khởi động Promoter) làm gene tháo xoắn để lộ mạch mã gốc có chiều 3’ → 5’ và bắt đầu tổng hợp RNA tại vị trí khởi đầu phiên mã.',
          },
          {
            stepNumber: 2,
            title: 'Giai đoạn 2: Kéo dài mạch RNA',
            description:
              'RNA polymerase trượt dọc theo mạch mã gốc của gene theo chiều 3’ → 5’, lắp ghép các ribonucleotide tự do (A, U, G, C) theo nguyên tắc bổ sung (A–U, T–A, G–C, C–G) tạo thành chuỗi RNA kéo dài theo chiều 5’ → 3’.',
          },
          {
            stepNumber: 3,
            title: 'Giai đoạn 3: Kết thúc phiên mã',
            description:
              'Khi RNA polymerase di chuyển tới cuối gene, gặp tín hiệu kết thúc phiên mã (ở đầu 5’ mạch mã gốc) thì dừng lại; phân tử RNA vừa tổng hợp được giải phóng và hai mạch của DNA xoắn trở lại như ban đầu.',
          },
        ],
        figures: [
          {
            id: 'doc1_p14_fig17',
            url: '/pdf-figures/doc1_p14_fig17.jpg',
            caption: 'Sơ đồ 3 giai đoạn của quá trình phiên mã: Mở đầu, Kéo dài và Kết thúc (ilovepdf_merged.pdf – Trang 14)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 14,
          },
          {
            id: 'doc1_p13_fig15',
            url: '/pdf-figures/doc1_p13_fig15.jpg',
            caption: 'Cơ chế lắp ghép nguyên tắc bổ sung của enzyme RNA polymerase trên mạch khuôn DNA (Trang 13 – Câu 40)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 13,
          },
          {
            id: 'doc1_p15_fig20',
            url: '/pdf-figures/doc1_p15_fig20.jpg',
            caption: 'So sánh quá trình phiên mã – dịch mã ở tế bào nhân sơ (a) và tế bào nhân thực (b) (Trang 15 – Câu 6)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 15,
          },
          {
            id: 'doc1_p16_fig21',
            url: '/pdf-figures/doc1_p16_fig21.jpg',
            caption: 'Sơ đồ khái quát quá trình phiên mã và loại bỏ intron tạo mRNA trưởng thành ở tế bào nhân thực (Trang 16 – Câu 7)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 16,
          },
          {
            id: 'doc1_p13_fig14',
            url: '/pdf-figures/doc1_p13_fig14.jpg',
            caption: 'Sơ đồ tóm tắt quá trình phiên mã ngược tạo DNA bổ sung (cDNA) từ khuôn mẫu RNA (Trang 13 – Câu 39)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 13,
          },
        ],
      },
      {
        id: 'b2-sec3',
        title: 'III. MÃ DI TRUYỀN VÀ ĐẶC ĐIỂM CỦA MÃ DI TRUYỀN',
        content: [
          'Khái niệm: Mã di truyền là trình tự các nucleotide trong gene (trên mạch gốc là triplet) hoặc trên mRNA (codon) quy định trình tự các amino acid trong phân tử protein. Mã di truyền là mã bộ ba: cứ 3 nucleotide đứng kế tiếp nhau trên mRNA (theo chiều 5’ → 3’) mã hóa cho một amino acid.',
          'Với 4 loại nucleotide (A, U, G, C), có tổng cộng 4^3 = 64 bộ ba trên mRNA, trong đó:',
          '• Có 3 bộ ba kết thúc (5’UAA3’, 5’UAG3’, 5’UGA3’): Không mã hóa amino acid nào, chỉ mang tín hiệu kết thúc quá trình dịch mã.',
          '• Có 61 bộ ba mã hóa cho các amino acid, trong đó bộ ba 5’AUG3’ là mã mở đầu: ở sinh vật nhân thực mã hóa amino acid Methionine (Met); ở sinh vật nhân sơ mã hóa Formyl-methionine (fMet).',
          'Bốn đặc điểm quan trọng của mã di truyền:',
          '1. Tính liên tục: Mã di truyền được đọc từ một điểm xác định (bộ ba mở đầu AUG) theo từng bộ ba nucleotide kế tiếp nhau (chiều 5’ → 3’) mà không gối lên nhau.',
          '2. Tính đặc hiệu: Một bộ ba chỉ mã hóa cho một loại amino acid duy nhất.',
          '3. Tính thoái hóa (dư thừa): Nhiều bộ ba khác nhau có thể cùng mã hóa cho một loại amino acid, ngoại trừ hai bộ ba là 5’AUG3’ (chỉ mã hóa Met/fMet) và 5’UGG3’ (chỉ mã hóa Tryptophan – Trp). Tính thoái hóa giúp hạn chế hậu quả của đột biến điểm thay thế cặp nucleotide.',
          '4. Tính phổ biến: Tất cả các loài sinh vật đều sử dụng chung một bộ mã di truyền, trừ một vài ngoại lệ nhỏ. Đặc tính này phản ánh nguồn gốc thống nhất của sinh giới.',
        ],
        figures: [
          {
            id: 'doc1_p14_fig18',
            url: '/pdf-figures/doc1_p14_fig18.jpg',
            caption: 'Bảng mã di truyền với 64 bộ ba trên mRNA (ilovepdf_merged.pdf – Trang 14)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 14,
          },
        ],
      },
      {
        id: 'b2-sec4',
        title: 'IV. QUÁ TRÌNH DỊCH MÃ VÀ TRUYỀN THÔNG TIN DI TRUYỀN',
        content: [
          'Khái niệm dịch mã: Là quá trình tổng hợp chuỗi polypeptide (protein) diễn ra ở tế bào chất (tại ribosome).',
          'Giai đoạn chuẩn bị (Hoạt hóa amino acid): Nhờ enzyme đặc hiệu và năng lượng ATP, mỗi amino acid tự do được hoạt hóa và gắn với tRNA tương ứng tạo thành phức hợp amino acid – tRNA (aa–tRNA).',
          'Giai đoạn tổng hợp chuỗi polypeptide gồm 3 bước: Mở đầu → Kéo dài → Kết thúc.',
          'Polyribosome (Polysome): Trên một phân tử mRNA thường có một nhóm nhiều ribosome cùng trượt qua để dịch mã đồng thời, giúp tăng hiệu suất tổng hợp các chuỗi polypeptide cùng loại.',
          'Công thức giải nhanh bài tập Dịch mã:',
          '• Số bộ ba (codon) trên mRNA = N_mRNA / 3 = N_gene / 6.',
          '• Số amino acid do môi trường cung cấp cho 1 lần dịch mã = (Số bộ ba trên mRNA) - 1 (trừ 1 bộ ba kết thúc).',
          '• Số amino acid trong chuỗi polypeptide hoàn chỉnh (sau khi cắt bỏ aa mở đầu) = (Số bộ ba trên mRNA) - 2.',
          '• Số phân tử nước (H2O) giải phóng khi hình thành chuỗi polypeptide (chưa cắt mở đầu) = Số liên kết peptide = Số aa được dịch mã - 1 = Số codon - 2.',
        ],
        processSteps: [
          {
            stepNumber: 1,
            title: 'Bước 1: Mở đầu dịch mã',
            description:
              'Tiểu đơn vị bé của ribosome gắn với mRNA ở vị trí nhận biết đặc hiệu (gần bộ ba mở đầu 5’AUG3’). Phức hợp mở đầu Met–tRNA (hoặc fMet–tRNA ở nhân sơ) mang bộ ba đối mã 3’UAC5’ tiến vào khớp bổ sung với codon mở đầu 5’AUG3’ trên mRNA. Sau đó tiểu đơn vị lớn của ribosome kết hợp với tiểu đơn vị bé tạo thành ribosome hoàn chỉnh.',
          },
          {
            stepNumber: 2,
            title: 'Bước 2: Kéo dài chuỗi polypeptide',
            description:
              'Phức hợp aa1–tRNA tiến vào ribosome, anticodon của nó khớp bổ sung với codon thứ hai trên mRNA. Liên kết peptide được hình thành giữa amino acid mở đầu và aa1. Ribosome dịch chuyển đi một bộ ba trên mRNA theo chiều 5’ → 3’, tRNA mở đầu rời khỏi ribosome. Quá trình tiếp diễn cho đến cuối mRNA.',
          },
          {
            stepNumber: 3,
            title: 'Bước 3: Kết thúc dịch mã',
            description:
              'Khi ribosome dịch chuyển tiếp xúc với một trong ba bộ ba kết thúc (UAA, UAG hoặc UGA) trên mRNA thì quá trình dịch mã dừng lại (yếu tố giải phóng tham gia). Hai tiểu phần của ribosome tách nhau ra, chuỗi polypeptide được giải phóng và cắt bỏ amino acid mở đầu để hình thành cấu trúc không gian bậc 1, 2, 3, 4 của protein.',
          },
        ],
        figures: [
          {
            id: 'doc1_p15_fig19',
            url: '/pdf-figures/doc1_p15_fig19.jpg',
            caption: 'Sơ đồ chi tiết các giai đoạn dịch mã: Mở đầu, Kéo dài và Kết thúc (ilovepdf_merged.pdf – Trang 15)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 15,
          },
          {
            id: 'doc1_p17_fig22',
            url: '/pdf-figures/doc1_p17_fig22.jpg',
            caption: 'Sơ đồ tổng quát quá trình truyền thông tin di truyền ở cấp độ phân tử: Tái bản DNA, Phiên mã, Phiên mã ngược và Dịch mã (Trang 17)',
            sourceDoc: 'ilovepdf_merged',
            pageNumber: 17,
          },
          {
            id: 'doc2_p01_fig02',
            url: '/pdf-figures/doc2_p01_fig02.jpg',
            caption: 'Sơ đồ mối quan hệ giữa Phiên mã trong nhân (B) và Dịch mã ngoài tế bào chất (A) ở tế bào nhân thực (Đề ôn tập số 1 – Trang 1)',
            sourceDoc: 'de_on_tap_12',
            pageNumber: 1,
          },
        ],
      },
    ],
    selfCheck: [
      {
        id: 'sc-b2-1',
        question: 'Bộ ba mở đầu trên mRNA là 5’AUG3’ thì bộ ba đối mã (anticodon) trên tRNA vận chuyển Methionine viết theo chiều chuẩn là gì?',
        answer:
          'Vì hai mạch khớp đối song song theo nguyên tắc bổ sung (A–U, U–A, G–C) nên đối diện với 5’AUG3’ là 3’UAC5’ (hay viết ngược lại là 5’CAU3’).',
      },
      {
        id: 'sc-b2-2',
        question: 'Một phân tử mRNA trưởng thành có 450 codon thực hiện dịch mã. Chuỗi polypeptide hoàn chỉnh (đã cắt bỏ amino acid mở đầu) có bao nhiêu amino acid?',
        answer:
          'Có 450 codon gồm 1 codon mở đầu, 448 codon mã hóa tiếp theo và 1 codon kết thúc (không mã hóa aa). Sau khi cắt bỏ aa mở đầu, chuỗi polypeptide hoàn chỉnh có 450 - 2 = 448 amino acid.',
      },
    ],
  },
  {
    id: 'chuyen-de-dieu-hoa-hoat-dong-gene',
    code: 'CHUYÊN ĐỀ 3',
    title: 'ĐIỀU HÒA BIỂU HIỆN GENE (MÔ HÌNH OPERON LAC)',
    subtitle: 'Cấu trúc Operon Lac ở E. coli · Cơ chế đóng/mở phiên mã khi không có và khi có Lactose',
    sourceInfo: 'Hệ thống hóa từ Bộ 5 Đề ôn tập 12 HS (Đề số 1, 2, 3, 4, 5)',
    isDirectFromPdf1Heading: false,
    summary:
      'Điều hòa hoạt động gene ở sinh vật nhân sơ chủ yếu diễn ra ở mức độ phiên mã. Mô hình Operon Lac ở vi khuẩn E. coli gồm vùng khởi động (P), vùng vận hành (O) và cụm 3 gene cấu trúc (lacZ, lacY, lacA). Gene điều hòa (lacI) nằm trước operon (không thuộc thành phần của operon) quy định tổng hợp protein ức chế.',
    keywords: [
      'Operon Lac (E. coli)',
      'Vùng khởi động (Promoter – P)',
      'Vùng vận hành (Operator – O)',
      'Cụm gene cấu trúc (lacZ, lacY, lacA)',
      'Gene điều hòa (lacI)',
      'Protein ức chế (Repressor)',
      'Chất cảm ứng Lactose / Allolactose',
    ],
    sections: [
      {
        id: 'cd3-sec1',
        title: 'I. CẤU TRÚC CỦA OPERON LAC Ở VI KHUẨN E. COLI',
        content: [
          'Theo mô hình của Jacob và Monod, một Operon Lac ở vi khuẩn E. coli bao gồm 3 thành phần nằm liền kề nhau trên phân tử DNA:',
          '1. Vùng khởi động (Promoter – P): Là trình tự nucleotide đặc hiệu nơi enzyme RNA polymerase bám vào để khởi đầu quá trình phiên mã cụm gene cấu trúc.',
          '2. Vùng vận hành (Operator – O): Nằm giữa vùng P và các gene cấu trúc; có trình tự nucleotide đặc hiệu để protein ức chế (repressor) liên kết vào nhằm ngăn cản quá trình phiên mã.',
          '3. Cụm gene cấu trúc (lacZ, lacY, lacA): Cùng nằm dưới sự kiểm soát chung của 1 vùng P và 1 vùng O, quy định tổng hợp các enzyme tham gia phân giải và sử dụng đường lactose. Khi hoạt động, cả 3 gene Z, Y, A được phiên mã chung thành 1 phân tử mRNA duy nhất (polycistronic mRNA) nhưng có 3 mã mở đầu riêng để dịch mã thành 3 chuỗi polypeptide khác nhau.',
          'Lưu ý quan trọng: Gene điều hòa (lacI) nằm phía trước operon nhưng KHÔNG thuộc thành phần cấu trúc của Operon Lac. Gene lacI luôn phiên mã và dịch mã tổng hợp protein ức chế ngay cả khi môi trường có hay không có lactose.',
        ],
        figures: [
          {
            id: 'doc2_p09_fig05',
            url: '/pdf-figures/doc2_p09_fig05.png',
            caption: 'Sơ đồ cấu trúc Operon Lac và gene điều hòa lacI ở vi khuẩn E. coli (Đề ôn tập 12 HS – Đề số 3, Trang 9)',
            sourceDoc: 'de_on_tap_12',
            pageNumber: 9,
          },
        ],
      },
      {
        id: 'cd3-sec2',
        title: 'II. CƠ CHẾ HOẠT ĐỘNG CỦA OPERON LAC',
        content: [
          '1. Khi môi trường KHÔNG có lactose: Gene điều hòa lacI tổng hợp protein ức chế ở trạng thái hoạt động. Protein ức chế bám chặt vào vùng vận hành (O), ngăn cản enzyme RNA polymerase trượt qua để phiên mã. Kết quả: Các gene cấu trúc Z, Y, A không được phiên mã (Operon ở trạng thái tắt).',
          '2. Khi môi trường CÓ đường lactose: Một lượng nhỏ lactose chuyển thành đồng phân allolactose đóng vai trò là chất cảm ứng (inducer). Chất cảm ứng liên kết với protein ức chế làm biến đổi cấu hình không gian của protein ức chế khiến nó bị bất hoạt và không thể bám vào vùng vận hành (O) (hoặc rời khỏi vùng O). Khi đó vùng O được tự do, enzyme RNA polymerase liên kết với vùng khởi động (P) và tiến hành phiên mã cụm gene cấu trúc Z, Y, A → dịch mã tạo các enzyme phân giải đường lactose.',
          '3. Khi môi trường có cả Glucose và Lactose: Vi khuẩn E. coli ưu tiên sử dụng đường Glucose trước vì glucose là đường đơn dễ hấp thu, không tốn năng lượng tổng hợp hệ enzyme phân giải như lactose.',
        ],
        comparisonTable: {
          title: 'Bảng tóm tắt trạng thái hoạt động của Operon Lac',
          headers: ['Thành phần', 'Môi trường KHÔNG có Lactose', 'Môi trường CÓ Lactose'],
          rows: [
            ['Gene điều hòa (lacI)', 'Phiên mã tạo protein ức chế', 'Vẫn phiên mã tạo protein ức chế'],
            ['Protein ức chế', 'Hoạt động, bám chặt vào vùng vận hành (O)', 'Bị chất cảm ứng (allolactose) làm biến đổi cấu hình → bất hoạt, rời khỏi vùng O'],
            ['Enzyme RNA polymerase', 'Bị cản trở, không phiên mã được cụm gene Z, Y, A', 'Trượt qua vùng O để phiên mã cụm gene cấu trúc Z, Y, A'],
            ['Trạng thái Operon', 'ĐÓNG (Không tổng hợp enzyme phân giải lactose)', 'MỞ (Tổng hợp enzyme phân giải lactose)'],
          ],
        },
      },
    ],
    selfCheck: [
      {
        id: 'sc-cd3-1',
        question: 'Gene điều hòa lacI có nằm trong thành phần cấu trúc của Operon Lac không? Khi có lactose thì gene lacI có ngừng tổng hợp protein ức chế không?',
        answer:
          'Không. Gene điều hòa lacI không thuộc cấu trúc của Operon Lac và nó vẫn tổng hợp protein ức chế bình thường ngay cả khi môi trường có lactose (nhưng protein ức chế tạo ra sẽ bị lactose làm bất hoạt).',
      },
    ],
  },
  {
    id: 'chuyen-de-dot-bien-gene-va-nst',
    code: 'CHUYÊN ĐỀ 4',
    title: 'ĐỘT BIẾN GENE & ĐỘT BIẾN NHIỄM SẮC THỂ',
    subtitle: 'Đột biến điểm · Cấu trúc siêu hiển vi của NST · Đột biến cấu trúc NST (Mất, Lặp, Đảo, Chuyển đoạn)',
    sourceInfo: 'Hệ thống hóa từ Bộ 5 Đề ôn tập 12 HS (Đề số 1, 2, 3, 4, 5)',
    isDirectFromPdf1Heading: false,
    summary:
      'Đột biến điểm là những biến đổi liên quan đến 1 cặp nucleotide trên gene (thay thế, mất hoặc thêm 1 cặp nucleotide). Ở cấp độ tế bào, DNA kết hợp với protein histone tạo nên cấu trúc nhiễm sắc thể (Nucleosome → Sợi cơ bản 11nm → Sợi nhiễm sắc 30nm → Siêu xoắn 300nm → Chromatid 700nm). Đột biến cấu trúc NST gồm 4 dạng: mất đoạn, lặp đoạn, đảo đoạn và chuyển đoạn.',
    keywords: [
      'Đột biến điểm (Thay thế, Mất, Thêm 1 cặp nu)',
      'Đột biến đồng nghĩa, sai nghĩa, vô nghĩa, lệch khung',
      'Chất hóa học 5-BrU (A-T → G-C)',
      'Nucleosome (146 cặp nu + 8 protein histone)',
      'Sợi cơ bản (11 nm) & Sợi nhiễm sắc (30 nm)',
      'Kì giữa nguyên phân (2n NST kép = 4n chromatid)',
      'Mất đoạn, Lặp đoạn, Đảo đoạn, Chuyển đoạn NST',
    ],
    sections: [
      {
        id: 'cd4-sec1',
        title: 'I. ĐỘT BIẾN GENE (ĐỘT BIẾN ĐIỂM)',
        content: [
          'Khái niệm: Đột biến gene là những biến đổi trong cấu trúc của gene, liên quan đến một hoặc một số cặp nucleotide. Đột biến chỉ liên quan đến 1 cặp nucleotide gọi là đột biến điểm.',
          'Các dạng đột biến điểm và sự thay đổi liên kết hydrogen:',
          '• Thay thế 1 cặp A–T bằng 1 cặp G–C: Tổng số nucleotide không đổi, số liên kết hydrogen tăng 1.',
          '• Thay thế 1 cặp G–C bằng 1 cặp A–T: Tổng số nucleotide không đổi, số liên kết hydrogen giảm 1.',
          '• Thay thế 1 cặp A–T bằng 1 cặp T–A (hoặc G–C bằng C–G): Tổng số nucleotide và tổng số liên kết hydrogen đều không đổi.',
          '• Mất (hoặc thêm) 1 cặp A–T: Số liên kết hydrogen giảm (hoặc tăng) 2 liên kết; làm dịch khung đọc mã di truyền (đột biến lệch khung) kể từ vị trí đột biến đến cuối gene.',
          '• Mất (hoặc thêm) 1 cặp G–C: Số liên kết hydrogen giảm (hoặc tăng) 3 liên kết; gây đột biến lệch khung.',
          'Phân loại theo hậu quả trên chuỗi polypeptide:',
          '• Đột biến đồng nghĩa (câm): Thay thế cặp nucleotide nhưng bộ ba mới vẫn mã hóa cùng amino acid cũ (do tính thoái hóa của mã di truyền).',
          '• Đột biến sai nghĩa: Bộ ba mới mã hóa cho một amino acid khác.',
          '• Đột biến vô nghĩa: Bộ ba mã hóa biến thành một trong ba bộ ba kết thúc (UAA, UAG, UGA) làm chuỗi polypeptide dừng tổng hợp sớm và bị ngắn lại.',
          'Tác nhân hóa học 5-bromouracil (5-BrU): Là chất đồng dạng của Thymine (T), gây đột biến thay thế cặp A–T thành cặp G–C.',
        ],
      },
      {
        id: 'cd4-sec2',
        title: 'II. CẤU TRÚC SIÊU HIỂN VI CỦA NHIỄM SẮC THỂ & ĐỘT BIẾN CẤU TRÚC NST',
        content: [
          'Các mức cấu trúc siêu hiển vi của NST ở sinh vật nhân thực:',
          '1. Phân tử DNA mạch kép (đường kính 2 nm).',
          '2. Nucleosome / Sợi cơ bản (đường kính khoảng 10 – 11 nm): Mỗi nucleosome gồm một đoạn DNA khoảng 146 cặp nucleotide quấn 1¾ vòng quanh khối cầu gồm 8 phân tử protein histone.',
          '3. Sợi nhiễm sắc / Sợi chất nhiễm sắc (đường kính khoảng 30 nm).',
          '4. Sợi siêu xoắn / Vùng xếp cuộn (đường kính khoảng 300 nm).',
          '5. Chromatid (đường kính khoảng 700 nm): Quan sát rõ nhất dưới kính hiển vi quang học vào KÌ GIỮA của quá trình phân bào khi NST đóng xoắn cực đại (ở kì giữa nguyên phân, tế bào 2n có 2n NST kép = 4n chromatid).',
          'Bốn dạng đột biến cấu trúc nhiễm sắc thể:',
          '• Mất đoạn: Làm giảm số lượng gene trên NST, thường gây chết hoặc giảm sức sống/khả năng sinh sản. Ứng dụng: Mất đoạn nhỏ dùng để loại bỏ các gene không mong muốn ở cây trồng.',
          '• Lặp đoạn: Làm tăng số lượng bản sao của gene trên NST, dẫn đến tăng cường hoặc giảm bớt mức biểu hiện tính trạng (ví dụ: lặp đoạn Bar làm mắt lồi thành mắt dẹt ở ruồi giấm), tạo điều kiện phát sinh gene mới trong tiến hóa.',
          '• Đảo đoạn: Làm thay đổi trình tự sắp xếp của các gene trên NST nhưng không làm thay đổi số lượng và thành phần gene; ít ảnh hưởng đến sức sống nhưng góp phần tạo nguyên liệu hình thành loài mới.',
          '• Chuyển đoạn: Sự trao đổi đoạn giữa các NST không tương đồng (tương hỗ hoặc không tương hỗ), làm thay đổi nhóm liên kết gene, thường làm giảm khả năng sinh sản của thể đột biến.',
        ],
      },
    ],
    selfCheck: [
      {
        id: 'sc-cd4-1',
        question: 'Tại sao đột biến thay thế 1 cặp nucleotide thường ít gây hậu quả nghiêm trọng hơn đột biến mất hoặc thêm 1 cặp nucleotide?',
        answer:
          'Vì đột biến thay thế 1 cặp nucleotide chỉ ảnh hưởng đến duy nhất 1 bộ ba tại vị trí đột biến (thậm chí không đổi amino acid nhờ tính thoái hóa của mã di truyền), trong khi mất/thêm 1 cặp nucleotide làm dịch khung đọc mã di truyền từ vị trí đột biến đến cuối gene.',
      },
    ],
  },
  {
    id: 'chuyen-de-cong-nghe-gene-va-thuc-hanh',
    code: 'CHUYÊN ĐỀ 5',
    title: 'CÔNG NGHỆ DNA, THỰC HÀNH TÁCH CHIẾT & ĐIỆN DI DNA',
    subtitle: 'Kĩ thuật tạo DNA tái tổ hợp · Quy trình tách chiết DNA · Phương pháp điện di DNA trên gel agarose',
    sourceInfo: 'Hệ thống hóa từ Bộ 5 Đề ôn tập 12 HS (Đề số 1, 2, 3, 4, 5)',
    isDirectFromPdf1Heading: false,
    summary:
      'Công nghệ DNA tái tổ hợp sử dụng enzyme cắt giới hạn (Restrictase) để cắt gene cần chuyển và vector (Plasmid/Phage), sau đó dùng enzyme DNA ligase để nối chúng tạo DNA tái tổ hợp. Trong thực hành sinh học phân tử, tách chiết DNA sử dụng muối NaCl, chất tẩy rửa (nước rửa bát), enzyme protease và cồn ethanol lạnh; còn phương pháp điện di trên gel agarose phân tách các đoạn DNA dựa vào điện tích âm của nhóm phosphate và kích thước phân tử.',
    keywords: [
      'DNA tái tổ hợp',
      'Vector chuyển gene (Plasmid / Phage)',
      'Enzyme cắt giới hạn (Restrictase)',
      'Enzyme nối DNA ligase',
      'Tách chiết DNA (NaCl, Nước rửa bát, Cồn ethanol lạnh)',
      'Điện di trên gel agarose (Cực âm → Cực dương)',
    ],
    sections: [
      {
        id: 'cd5-sec1',
        title: 'I. CÔNG NGHỆ DNA TÁI TỔ HỢP',
        content: [
          'Khái niệm: DNA tái tổ hợp là một phân tử DNA nhỏ được lắp ghép từ các đoạn DNA lấy từ các tế bào/sinh vật khác nhau (gồm gene cần chuyển gắn vào thể truyền/vector).',
          'Các thành phần tham gia tạo DNA tái tổ hợp:',
          '• Thể truyền (Vector): Phổ biến là Plasmid (phân tử DNA dạng vòng nhỏ nằm trong tế bào chất của vi khuẩn, có khả năng nhân đôi độc lập) hoặc thể thực khuẩn (phage).',
          '• Enzyme cắt giới hạn (Restrictase): Nhận biết và cắt đứt liên kết phosphodiester tại các trình tự nucleotide đặc hiệu trên cả DNA chứa gene cần chuyển và plasmid. Lưu ý: Nếu 1 phân tử DNA mạch vòng (như Plasmid) có 1 vị trí nhận biết của enzyme giới hạn thì khi bị cắt sẽ tạo ra 1 đoạn DNA mạch thẳng; nếu phân tử DNA mạch thẳng có k vị trí cắt thì tạo ra (k + 1) đoạn.',
          '• Enzyme nối (DNA ligase): Xúc tác hình thành liên kết cộng hóa trị phosphodiester nối đoạn gene cần chuyển vào plasmid đã mở vòng, tạo nên phân tử Plasmid tái tổ hợp.',
        ],
        figures: [
          {
            id: 'doc2_p03_fig03',
            url: '/pdf-figures/doc2_p03_fig03.jpg',
            caption: 'Hình 10. Sơ đồ cắt nối tạo Plasmid tái tổ hợp Z từ Gene M (1500 bp) và Plasmid T (2700 bp) (Đề ôn tập số 1 – Trang 3)',
            sourceDoc: 'de_on_tap_12',
            pageNumber: 3,
          },
        ],
      },
      {
        id: 'cd5-sec2',
        title: 'II. QUY TRÌNH TÁCH CHIẾT DNA VÀ PHƯƠNG PHÁP ĐIỆN DI TRÊN GEL AGAROSE',
        content: [
          '1. Nguyên lý các bước trong thí nghiệm Tách chiết DNA từ tế bào sống (gan lợn, chuối, dứa...):',
          '• Bước 1 (Nghiền mẫu vật & Lọc): Phá vỡ cơ học mô và thành tế bào (ở thực vật), lọc qua gạc/giấy lọc để loại bỏ các mảnh vụn tế bào lớn, thu dịch lọc.',
          '• Bước 2 (Cho dung dịch nước rửa bát / chất tẩy rửa và muối NaCl): Chất hoạt động bề mặt trong nước rửa bát giúp hòa tan lớp kép phospholipid, phá hủy màng sinh chất và màng nhân để giải phóng dịch nhân chứa DNA. Muối NaCl cung cấp các ion Na+ giúp trung hòa điện tích âm của các nhóm phosphate trên DNA, giúp các phân tử DNA co cụm và dễ kết tủa hơn khi gặp cồn.',
          '• Bước 3 (Bổ sung nước cốt dứa / enzyme protease): Phân giải các protein histone liên kết với DNA.',
          '• Bước 4 (Rót từ từ cồn ethanol lạnh 70% – 96% dọc thành ống nghiệm): Vì cồn có ái lực mạnh với nước và DNA không tan trong cồn lạnh, các phân tử DNA bị đẩy ra và kết tủa thành lớp sợi màu trắng đục ở ranh giới giữa hai lớp dung dịch.',
          '2. Nguyên lý phương pháp Điện di DNA trên gel agarose:',
          '• Do chứa các nhóm phosphate tích điện âm trên khung đường – phosphate, khi đặt trong điện trường, các đoạn DNA luôn di chuyển từ CỰC ÂM sang CỰC DƯƠNG.',
          '• Tốc độ di chuyển phụ thuộc vào kích thước (chiều dài bp/kb) của đoạn DNA: Đoạn DNA có kích thước càng NHỎ (ngắn) thì di chuyển càng NHANH và đi được quãng đường càng XA về phía cực dương; đoạn DNA kích thước lớn di chuyển chậm hơn và nằm gần giếng tra mẫu.',
        ],
        figures: [
          {
            id: 'doc2_p01_fig01',
            url: '/pdf-figures/doc2_p01_fig01.jpg',
            caption: 'Hình 1 và Bảng 1. Vị trí cắt của các enzyme giới hạn (HindIII, EcoRI, AluI) và bản điện di các đoạn DNA (Đề ôn tập số 1 – Trang 1)',
            sourceDoc: 'de_on_tap_12',
            pageNumber: 1,
          },
        ],
      },
    ],
    selfCheck: [
      {
        id: 'sc-cd5-1',
        question: 'Trong Hình 1 và Bảng 1 điện di DNA (Đề số 1 – Câu 6), xử lý đoạn DNA 6 kb bằng enzyme HindIII tạo ra các đoạn có kích thước bao nhiêu kb và ứng với mẫu nào trên bản điện di?',
        answer:
          'Trên Hình 1, enzyme HindIII cắt tại 2 vị trí tạo ra 3 đoạn có kích thước 1 kb, 3 kb và 2 kb. Đối chiếu Bảng 1 điện di, Mẫu 4 (M4) có đúng 3 vạch ở vị trí 3 kb, 2 kb và 1 kb.',
      },
    ],
  },
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-01',
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    front: 'Bốn chức năng chính của phân tử DNA là gì?',
    back: '1. Mang và bảo quản thông tin di truyền.\n2. Truyền thông tin di truyền qua các thế hệ (nhờ tái bản).\n3. Biểu hiện thông tin di truyền (qua phiên mã và dịch mã).\n4. Tạo biến dị di truyền.',
    sourceRef: 'ilovepdf_merged.pdf – Bài 1, Trang 1',
  },
  {
    id: 'fc-02',
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    front: 'Khái niệm Gene theo tài liệu nguồn là gì?',
    back: 'Gene là đoạn trình tự nucleotide trên DNA mang thông tin di truyền mã hóa RNA hoặc chuỗi polypeptide.',
    sourceRef: 'ilovepdf_merged.pdf – Bài 1, Trang 1',
  },
  {
    id: 'fc-03',
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    front: 'Ba vùng cấu trúc của một gene điển hình và chức năng từng vùng?',
    back: '• Vùng điều hòa: Có trình tự khởi động tổng hợp RNA → điều hòa lượng sản phẩm của gene.\n• Vùng mã hóa: Chứa thông tin di truyền quy định trình tự RNA hoặc chuỗi polypeptide.\n• Vùng kết thúc: Mang tín hiệu kết thúc quá trình tổng hợp RNA.',
    sourceRef: 'ilovepdf_merged.pdf – Bài 1, Trang 1',
  },
  {
    id: 'fc-04',
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    front: 'Phân biệt Exon và Intron trong gene phân mảnh ở sinh vật nhân thực?',
    back: '• Exon: Các đoạn trình tự nucleotide được dịch mã (mã hóa amino acid).\n• Intron: Các đoạn trình tự nucleotide không được dịch mã (không mã hóa amino acid), bị cắt bỏ sau phiên mã.',
    sourceRef: 'ilovepdf_merged.pdf – Bài 1, Trang 1',
  },
  {
    id: 'fc-05',
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    front: 'Vai trò của enzyme DNA polymerase và DNA ligase trong tái bản DNA?',
    back: '• DNA polymerase: Tổng hợp mạch mới theo nguyên tắc bổ sung với mạch khuôn theo chiều 5’ → 3’.\n• DNA ligase: Nối các đoạn Okazaki thành mạch ra chậm hoàn chỉnh.',
    sourceRef: 'ilovepdf_merged.pdf – Bài 1, Trang 2',
  },
  {
    id: 'fc-06',
    lessonId: 'bai-1-gen-va-tai-ban-dna',
    front: 'Công thức liên hệ giữa chiều dài L, tổng số nucleotide N, số chu kì xoắn C và số liên kết hydrogen H của gene?',
    back: '• N = 2A + 2G (với A = T, G = C)\n• C = N / 20\n• L = (N / 2) × 3,4 Å = (N / 2) × 0,34 nm\n• H = 2A + 3G\n• Số liên kết phosphodiester giữa các nu = N - 2',
    sourceRef: 'Bài 1 & Đề ôn tập 1–5',
  },
  {
    id: 'fc-07',
    lessonId: 'bai-2-bieu-hien-thong-tin-di-truyen',
    front: 'Bộ ba mở đầu trên mRNA và bộ ba đối mã (anticodon) tương ứng trên tRNA là gì?',
    back: '• Bộ ba mở đầu trên mRNA: 5’ AUG 3’ (mã hóa Met ở nhân thực, fMet ở nhân sơ).\n• Bộ ba đối mã trên tRNA mở đầu: 3’ UAC 5’ (hay viết từ đầu 5’ là 5’ CAU 3’).',
    sourceRef: 'ilovepdf_merged.pdf – Bài 2, Câu 7 Trang 10',
  },
  {
    id: 'fc-08',
    lessonId: 'bai-2-bieu-hien-thong-tin-di-truyen',
    front: 'Ba bộ ba kết thúc trên phân tử mRNA là những bộ ba nào?',
    back: '5’ UAA 3’, 5’ UAG 3’ và 5’ UGA 3’. Ba bộ ba này không mã hóa cho amino acid nào và không có tRNA tương ứng.',
    sourceRef: 'ilovepdf_merged.pdf – Bài 2, Trang 12 & 14',
  },
  {
    id: 'fc-09',
    lessonId: 'bai-2-bieu-hien-thong-tin-di-truyen',
    front: 'Hai bộ ba duy nhất trong bảng mã di truyền KHÔNG có tính thoái hóa là gì?',
    back: '5’ AUG 3’ (chỉ mã hóa Methionine / fMet) và 5’ UGG 3’ (chỉ mã hóa Tryptophan).',
    sourceRef: 'ilovepdf_merged.pdf – Bài 2, Câu 32 Trang 12',
  },
  {
    id: 'fc-10',
    lessonId: 'bai-2-bieu-hien-thong-tin-di-truyen',
    front: 'Điểm khác nhau cơ bản giữa enzyme DNA polymerase và RNA polymerase?',
    back: '• RNA polymerase vừa có khả năng tự tháo xoắn một đoạn DNA, vừa xúc tác kéo dài chuỗi polynucleotide trên 1 mạch khuôn 3’→5’ mà không cần đoạn mồi.\n• DNA polymerase không tự tháo xoắn DNA và cần đoạn mồi RNA để khởi đầu.',
    sourceRef: 'ilovepdf_merged.pdf – Bài 2, Câu 13 Trang 11',
  },
  {
    id: 'fc-11',
    lessonId: 'chuyen-de-dieu-hoa-hoat-dong-gene',
    front: 'Trong mô hình Operon Lac ở E. coli, vùng P và vùng O có vai trò gì?',
    back: '• Vùng khởi động (P – Promoter): Nơi enzyme RNA polymerase bám vào để khởi đầu phiên mã.\n• Vùng vận hành (O – Operator): Nơi protein ức chế liên kết để ngăn cản quá trình phiên mã khi không có lactose.',
    sourceRef: 'Đề ôn tập 12 HS – Đề số 1, 2, 3',
  },
  {
    id: 'fc-12',
    lessonId: 'chuyen-de-dot-bien-gene-va-nst',
    front: 'Cấu trúc của một Nucleosome và kích thước các bậc cấu trúc siêu hiển vi của NST?',
    back: '• Nucleosome: 146 cặp nucleotide quấn quanh khối 8 phân tử protein histone.\n• Sợi cơ bản: 11 nm → Sợi nhiễm sắc: 30 nm → Siêu xoắn: 300 nm → Chromatid: 700 nm.',
    sourceRef: 'Đề ôn tập 12 HS – Đề số 1, 2, 4, 5',
  },
  {
    id: 'fc-13',
    lessonId: 'chuyen-de-cong-nghe-gene-va-thuc-hanh',
    front: 'Vai trò của Nước rửa bát, Muối ăn (NaCl) và Cồn ethanol lạnh trong thực hành tách chiết DNA?',
    back: '• Nước rửa bát: Phá hủy màng tế bào và màng nhân (hòa tan lipid).\n• Muối NaCl: Trung hòa điện tích âm của DNA giúp DNA dễ kết tủa.\n• Cồn ethanol lạnh (70–96%): Làm kết tủa DNA thành lớp sợi trắng đục ở ranh giới pha.',
    sourceRef: 'Đề ôn tập 12 HS – Đề số 1, 2, 3, 4, 5',
  },
  {
    id: 'fc-14',
    lessonId: 'chuyen-de-cong-nghe-gene-va-thuc-hanh',
    front: 'Trong phương pháp điện di trên gel agarose, DNA di chuyển về cực nào và đoạn nào chạy nhanh hơn?',
    back: '• DNA mang điện tích âm (do nhóm phosphate) nên di chuyển từ cực âm về CỰC DƯƠNG.\n• Đoạn DNA có kích thước càng NHỎ (ngắn) thì di chuyển càng NHANH và đi được quãng đường xa hơn.',
    sourceRef: 'Đề ôn tập 12 HS – Đề số 3, 4, 5',
  },
];
