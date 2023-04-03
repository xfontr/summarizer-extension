import { SUMMARY_MIN_LENGTH } from "../configs/constants.js";
import Query, { QueryMaxLengthCount, ResponseFormat } from "../types/Query.js";

const query: Query = {
  pageContent: "",
  queryRules: {
    focusOn: [],
    responseMaxLength: SUMMARY_MIN_LENGTH.words,
    maxLengthCount: "words",
    responseFormat: "summary",
    getFromSelection: false,
  },
  query: "",
};

const queryStore = () => {
  const setResponseMaxLength = (maxLength: number): void => {
    query.queryRules.responseMaxLength =
      maxLength < SUMMARY_MIN_LENGTH[query.queryRules.maxLengthCount]
        ? SUMMARY_MIN_LENGTH[query.queryRules.maxLengthCount]
        : maxLength;
  };

  const setMaxLengthCount = (maxLengthCount: QueryMaxLengthCount): void => {
    query.queryRules.maxLengthCount = maxLengthCount;
  };

  const setPageContent = (pageContent: string): void => {
    query.pageContent = pageContent;
  };

  const setResponseFormat = (responseFormat: ResponseFormat): void => {
    query.queryRules.responseFormat = responseFormat;
  };

  const setKeywords = (keywords: string[]): void => {
    query.queryRules.focusOn = keywords;
  };

  const setQuerySource = (getFromSelection: boolean): void => {
    query.queryRules.getFromSelection = getFromSelection;
  };

  const buildQuery = (onPreviousMessages?: boolean): void => {
    const maxLength = `${query.queryRules.responseMaxLength} ${query.queryRules.maxLengthCount}`;
    const keywords = query.queryRules.focusOn.join(", ");
    const responseFormat =
      query.queryRules.responseFormat === "bulletPoints"
        ? "bullet points (a list), which means I will need you to provide me with a list of the main points of the text"
        : "a regular text, so avoid doing lists or bullet points";
    const textToSummarize = onPreviousMessages
      ? "the combination of the previous messages I've sent you during this chat."
      : `the following one:
      ${query.pageContent}`;

    let baseQuery = `I want you to summarize me a text. Your response (the summary) must have a maximum of ${maxLength}.`;

    baseQuery = query.queryRules.focusOn.length
      ? `${baseQuery} While summarizing, you'll have to focus on the following keywords: ${keywords}.`
      : baseQuery;

    baseQuery = `${baseQuery} The style of your response will have to be in ${responseFormat}.`;

    query.query = `${baseQuery} The text I need you to summarize with the previous requirements is ${textToSummarize}`;
  };

  const getQuery = (): string => query.query;
  const getQueryRules = (): Query["queryRules"] => query.queryRules;

  return () => ({
    setResponseMaxLength,
    setMaxLengthCount,
    setPageContent,
    setResponseFormat,
    setQuerySource,
    buildQuery,
    getQuery,
    getQueryRules,
    setKeywords,
  });
};

export const useQuery = queryStore();

export const queryBuildMiddleware = (pageContent: string): string => {
  const { buildQuery, getQuery, setPageContent } = useQuery();

  setPageContent(pageContent);
  buildQuery(!!!pageContent);
  return getQuery();
};
