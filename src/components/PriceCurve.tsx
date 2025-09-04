import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  supply: number;
  price: number;
}

interface PriceCurveProps {
  currentPrice: number;
  currentSupply: number;
  k: number; // Bonding curve constant
}

export function PriceCurve({ currentPrice, currentSupply, k }: PriceCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
    // Generate points for the price curve
    const points = [];
    const numPoints = 100;
    const maxSupply = currentSupply * 2; // Show curve up to 2x current supply
    
    for (let i = 0; i < numPoints; i++) {
      const supply = (i / numPoints) * maxSupply;
      const price = k / (supply + 1); // Basic bonding curve formula
      points.push({ supply, price });
    }
    return points;
  }, [currentSupply, k]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous contents
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, (d: DataPoint) => d.supply) || 0])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: DataPoint) => d.price) || 0])
      .range([height, 0]);

    // Create line generator
    const line = d3.line<DataPoint>()
      .x((d: DataPoint) => x(d.supply))
      .y((d: DataPoint) => y(d.price))
      .curve(d3.curveMonotoneX);

    // Add the line path
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add current point
    svg.append("circle")
      .attr("cx", x(currentSupply))
      .attr("cy", y(currentPrice))
      .attr("r", 5)
      .attr("fill", "#ef4444");

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .append("text")
      .attr("x", width)
      .attr("y", -10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text("Supply");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text("Price");

  }, [data, currentPrice, currentSupply]);

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow p-4">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
