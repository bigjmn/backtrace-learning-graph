"use server"
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export interface SourceResult {
    summary: string;
    title: string|null;
    url: string;
    id: string
}


export const resourceSearch = async (question:string) => {
  try {
    console.log('Searching for:', question);
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Updated to valid model
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Find educational resources for: ${question}`
        }
      ],
      tools: [{
        type: "web_search_20250305",
        name: "web_search",
      }]
    });
    console.log('API Response:', JSON.stringify(response, null, 2));
  
  const resultlist:SourceResult[] = [];
  console.log(response.content)
  response.content.forEach((sr, idx) => {
    if (sr.type === "text" && sr.citations && sr.citations.length>0){
        sr.citations.forEach((scit) => {
            if (scit.type === "web_search_result_location"){
                const newsrc:SourceResult = {url: scit.url, title: scit.title ?? null, summary: sr.text, id:idx.toString()}
                resultlist.push(newsrc)
            }
        })
        


    }
    
    if (sr.type === "web_search_tool_result"){
        const srcon = sr.content 
        if (Array.isArray(srcon)) {
            srcon.forEach((sru) => {
                if (sru.type === "web_search_result"){
                    const srures:SourceResult = {summary: "", url: sru.url, title: sru.title, id:idx.toString()}
                    resultlist.push(srures)
                }
            })
        }
    }
  })
  
  console.log('Parsed results:', resultlist);
  return resultlist;
  
  } catch (error) {
    console.error('resourceSearch error:', error);
    throw error;
  }
}