import {
  loadUserProducts,
  saveUserProducts,
} from "./storage";
export const PRODUCTS = [
  // 라면
  {
    name: "신라면 소컵",
    category: "라면",
  },
  {
    name: "신라면 대컵",
    category: "라면",
  },
  {
    name: "불닭볶음면 대컵",
    category: "라면",
  },
  {
    name: "불닭볶음면 소컵",
    category: "라면",
  },
  {
    name: "왕뚜껑 김치 대컵",
    category: "라면",
  },
  {
    name: "왕뚜껑 국물라볶이 대컵",
    category: "라면",
  },
  {
    name: "육개장 사발면 소컵",
    category: "라면",
  },
  {
    name: "김치 사발면 소컵",
    category: "라면",
  },
  {
    name: "오징어짬뽕 소컵",
    category: "라면",
  },
  {
    name: "신라면 툼바",
    category: "라면",
  },
  {
    name: "오모리 김치찌개",
    category: "라면",
  },
  {
    name: "오모리 부대찌개",
    category: "라면",
  },
  {
    name: "팔도 도시락면",
    category: "라면",
  },
  {
    name: "팔도 김치 도시락면",
    category: "라면",
  },
  {
    name: "튀김우동 대컵",
    category: "라면",
  },
  {
    name: "튀김우동 소컵",
    category: "라면",
  },
  {
    name: "로제 불닭볶음면",
    category: "라면",
  },
  {
    name: "까르보 불닭볶음면",
    category: "라면",
  },
  {
    name: "치즈 불닭볶음면",
    category: "라면",
  },
  {
    name: "짜파구리",
    category: "라면",
  },
  {
    name: "스낵면",
    category: "라면",
  },
  {
    name: "불닭볶음탕면",
    category: "라면",
  },
  {
    name: "짜파게티",
    category: "라면",
  },
  {
    name: "사천짜파게티",
    category: "라면",
  },
  {
    name: "콕콕콕 스파게티",
    category: "라면",
  },
  {
    name: "콕콕콕 라파게티",
    category: "라면",
  },
  {
    name: "콕콕콕 라면볶이",
    category: "라면",
  },
  {
    name: "열라면 대컵",
    category: "라면",
  },
  {
    name: "새우탕 대컵",
    category: "라면",
  },

  // 과자
  {
    name: "오징어땅콩",
    category: "과자",
  },
  {
    name: "못말리는 신짱구",
    category: "과자",
  },
  {
    name: "홈런볼 소",
    category: "과자",
  },
  {
    name: "홈런볼 대",
    category: "과자",
  },
  {
    name: "포카칩 오리지날",
    category: "과자",
  },
  {
    name: "포카칩 양파맛",
    category: "과자",
  },
  {
    name: "땅콩강정 소",
    category: "과자",
  },
  {
    name: "땅콩강정 대",
    category: "과자",
  },
  {
    name: "꿀꽈배기",
    category: "과자",
  },
  {
    name: "조청유과",
    category: "과자",
  },
  {
    name: "포스틱",
    category: "과자",
  },
  {
    name: "스윙칩",
    category: "과자",
  },
  {
    name: "생생감자칩 오사쯔맛",
    category: "과자",
  },
  {
    name: "사또밥",
    category: "과자",
  },
  {
    name: "콘칲",
    category: "과자",
  },
  {
    name: "허니버터칩",
    category: "과자",
  },
  {
    name: "카라멜콘땅콩",
    category: "과자",
  },
  {
    name: "뿌셔뿌셔 바베큐맛",
    category: "과자",
  },
  {
    name: "뿌셔뿌셔 양넘치킨맛",
    category: "과자",
  },
  {
    name: "뿌셔뿌셔 불고기맛",
    category: "과자",
  },
  {
    name: "뿌셔뿌셔 구운양파맛",
    category: "과자",
  },
  {
    name: "새우깡",
    category: "과자",
  },
  {
    name: "매운 새우깡",
    category: "과자",
  },
  {
    name: "와사비 새우깡",
    category: "과자",
  },
  {
    name: "도도한 나쵸 치즈맛",
    category: "과자",
  },
  {
    name: "츄러스",
    category: "과자",
  },
  {
    name: "초코 츄러스",
    category: "과자",
  },
  {
    name: "썬칩 스파이시맛",
    category: "과자",
  },
  {
    name: "썬칩 대파크림치즈맛",
    category: "과자",
  },
  {
    name: "양파링",
    category: "과자",
  },
  {
    name: "바나나킥",
    category: "과자",
  },
  {
    name: "오감자",
    category: "과자",
  },
  {
    name: "오감자 버터갈릭맛",
    category: "과자",
  },
];
export function getAllProducts() {
  return [
    ...PRODUCTS,
    ...loadUserProducts(),
  ];
}

function normalizeProductName(name: string) {
  return name.trim().toLowerCase();
}

export function searchProducts(keyword: string) {
  const seenNames = new Set<string>();

  return getAllProducts()
    .filter((product) =>
      product.name
        .toLowerCase()
        .includes(keyword.toLowerCase())
    )
    .filter((product) => {
      const normalizedName = normalizeProductName(
        product.name
      );

      if (seenNames.has(normalizedName)) {
        return false;
      }

      seenNames.add(normalizedName);
      return true;
    })
    .slice(0, 5);
}

export function getUserProducts() {
  return loadUserProducts();
}

export function searchUserProducts(
  keyword: string
) {
  return getUserProducts().filter((product) =>
    product.name
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );
}

export function isDuplicateProduct(
  name: string,
  excludeId?: string
) {
  const normalizedName = normalizeProductName(name);

  const existsInDefault = PRODUCTS.some(
    (product) =>
      normalizeProductName(product.name) === normalizedName
  );

  if (existsInDefault) return true;

  return getUserProducts().some(
    (product) =>
      normalizeProductName(product.name) === normalizedName &&
      product.id !== excludeId
  );
}

export function updateUserProduct(
  id: string,
  data: {
    name: string;
    category: string;
  }
) {
  const userProducts = getUserProducts();

  const updatedProducts = userProducts.map((product) =>
    product.id === id
      ? {
          ...product,
          ...data,
        }
      : product
  );

  saveUserProducts(updatedProducts);
}

export function deleteUserProduct(
  id: string
) {
  const userProducts = getUserProducts();

  const filteredProducts = userProducts.filter(
    (product) => product.id !== id
  );

  saveUserProducts(filteredProducts);
}

export function addUserProduct(
  name: string,
  category: string
) {
  const userProducts = loadUserProducts();

  const existsInDefault = PRODUCTS.some(
    (product) => product.name === name
  );

  const existsInUser = userProducts.some(
    (product) => product.name === name
  );

  if (!existsInDefault && !existsInUser) {
    saveUserProducts([
      ...userProducts,
      {
        id: crypto.randomUUID(),
        name,
        category,
        createdAt: Date.now(),
      },
    ]);
  }
}

