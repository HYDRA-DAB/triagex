export const fetchMedicalContext = async (query) => {
  try {
    // 1. Search PubMed for matching UIDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=3&retmode=json`;
    const searchRes = await fetch(searchUrl);
    
    if (!searchRes.ok) return [];
    
    const searchData = await searchRes.json();
    const idlist = searchData.esearchresult?.idlist || [];
    
    if (idlist.length === 0) return [];

    // 2. Fetch summaries for those UIDs
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idlist.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    
    if (!summaryRes.ok) return [];

    const summaryData = await summaryRes.json();
    const results = summaryData.result || {};
    
    const contextArray = [];
    
    // 3. Extract Titles & Summaries (ignoring the 'uids' key)
    for (const id of idlist) {
      if (results[id]) {
        const title = results[id].title || '';
        // Some records have source/clinical data in 'source' or just use title if summary is missing
        contextArray.push(title);
      }
    }
    
    return contextArray;
  } catch (error) {
    console.error("NCBI Fetch failed:", error);
    return [];
  }
};
