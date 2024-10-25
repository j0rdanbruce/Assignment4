import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {wordFrequency:[]};
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }


  renderChart() {
    const data = this.state.wordFrequency.sort((a,b)=>b[1]-a[1]).slice(0,5)
    console.log(data)
    // your code here
    
    //dimensions of child 2
    var margin = { top: 30, right: 200, bottom: 40, left: 10 },
      w = 1000,
      h = 300;
    //svg container for word cloud box
    var container = d3.select('.svg_parent')
    container.attr('width', w).attr('height', h)

    //linear scale for horizontal positioning
    var x_data = data.map(item => item[0])
    var x_scale = d3.scaleLinear().domain([0, x_data.length - 1]).range([margin.left, w-margin.right]);
    //console.log(x_data)
    //console.log(x_scale("city"))

    //linear scale for font size
    var freq_data = data.map(item => item[1])
    var freq_scale = d3.scaleLinear().domain([0, d3.max(freq_data)]).range([0, 60]);
    //console.log(freq_scale(2))
    
    //attributes and animations for word cloud container
    container.selectAll("text")
      .data(data, d => d[0])
      .join(
        enter => enter.append('text')
          .attr('text-anchor', 'start')
          .attr('dy', h/2)
          .attr('x', (d,i) => x_scale(i))
          .style('font-size', 0)
          .text(d => d[0])
          .transition().duration(3000)
          .style('font-size', d => (freq_scale(d[1]) + 'px')),
        
        update => update.transition().duration(3000)
          .attr('x', (d,i) => x_scale(i))
          .style('font-size', d => (freq_scale(d[1]) + 'px')),

        exit => exit.transition().remove()
      );
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{width: 1000 }}>
        <textarea type="text" id="input_field" style={{ height: 150, width: 1000 }}/>
          <button type="submit" value="Generate Matrix" style={{ marginTop: 10, height: 40, width: 1000 }} onClick={() => {
                var input_data = document.getElementById("input_field").value
                this.setState({wordFrequency:this.getWordFrequency(input_data)})
              }}
            > Generate WordCloud</button>
        </div>
        <div className="child2"><svg className="svg_parent"></svg></div>
      </div>
    );
  }
}

export default App;
