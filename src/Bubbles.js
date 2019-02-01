import React, { Component } from 'react';
import chroma from 'chroma-js'
import * as d3 from 'd3'
import Data from "./Data"


var width = 800
var height = 800
var radius = (10)
var colorScale = chroma.scale(['pink', 'blue']).mode('lch').colors(Data.length)
var simulation = d3.forceSimulation(Data)
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collide', d3.forceCollide(radius))


class Bubbles extends Component {
  componentWillMount() {
    simulation.on('tick', this.forceTick)
  }

  componentDidMount() {
    this.container = d3.select(this.refs.container)
    this.renderCircles()
    simulation.nodes(Data).alpha(.4).restart()
    d3.selectAll("circle")
      .on("mouseover", (d, i) => {
        d.x += 20
        d.y += 20
      })
      .on("mouseout", (d, i) => {
        d.x -= 20
        d.y -= 20
      });

    /* Animation example */
    // d3.selectAll("circle").transition()
    //   .duration(750)
    //   .delay(function (d, i) { return i * 500; })
    //   .attr("r", function (d) { return Math.sqrt(d * 4); });
    // d3.select('circle').node().dispatchEvent(grow);s]


  }
  componentDidUpdate() {
    this.renderCircles()
  }

  renderCircles() {
    //draw circles
    this.circles = this.container.selectAll('circle')
      .data(Data, (d, i) => d[i])
      .attr('cx', width / 2)
      .attr('cy', height / 2)

    //enter/update
    this.circles = this.circles.enter().append('circle')
      .merge(this.circles)
      .attr('r', radius)
      .attr('fill-opacity', 0.5)
      .attr('stroke-width', 2)
      .attr('fill', (d, i) => colorScale[i])
      .attr('stroke', (d, i) => colorScale[i])
    //exit
    this.circles.exit().remove()

  }

  forceTick = () => {
    this.circles.attr('cx', d => d.x).attr('cy', d => d.y)
  }

  render() {
    return (
      <svg width={width} height={height} ref='container' />
    )
  }
}
export default Bubbles
