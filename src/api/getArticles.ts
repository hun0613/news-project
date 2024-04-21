import axios from "axios";
import { CountryType } from "../store/types";

interface Props {
  headline: string;
  date: string;
  country: CountryType[];
  scrapIdArr?: string[];
}

const getArticles = async ({ headline, date, country, scrapIdArr }: Props, pageParam: number) => {
  // 최종 쿼리에 들어갈 국가 문자열
  let makedCountry = "";

  // 최종 국가 문자열 만드는 알고리즘
  if (country.length > 0) {
    for (let i = 0; i < country.length; i++) {
      if (i !== country.length - 1) {
        makedCountry = makedCountry + `"${country[i].ctyCd}", `;
      } else {
        makedCountry = makedCountry + `"${country[i].ctyCd}"`;
      }
    }
  }

  // 최종 쿼리에 들어갈 스크랩 문자열
  let makedScrapId = "";

  if (scrapIdArr) {
    for (let i = 0; i < scrapIdArr.length; i++) {
      if (i !== scrapIdArr.length - 1) {
        makedScrapId = makedScrapId + `"${scrapIdArr[i]}", `;
      } else {
        makedScrapId = makedScrapId + `"${scrapIdArr[i]}"`;
      }
    }
  }

  // 날짜 쿼리
  let dateQuery = date ? `&begin_date=${date.replaceAll("-", "")}&end_date=${date.replaceAll("-", "")}` : "";
  // 국가, 헤드라인 쿼리
  let fqQuery1 = `&fq=${country.length > 0 ? `glocations:(${makedCountry})` : ""}${country.length > 0 && headline ? " AND " : ""}${
    headline ? `headline:("${headline}")` : ""
  }${(country.length > 0 || headline) && scrapIdArr ? " AND " : ""}${scrapIdArr ? `web_url:(${makedScrapId})` : ""}`;

  return await axios.get(
    `/svc/search/v2/articlesearch.json?api-key=${process.env.REACT_APP_NYT_API_KEY}&sort=newest&page=${pageParam}${dateQuery}${fqQuery1}`,
    {
      baseURL: process.env.REACT_APP_NYT_API_ADDRESS,
    }
  );
};

export default getArticles;
