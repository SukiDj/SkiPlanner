import { useEffect, useState } from "react";
import { Divider, Header, Icon, Statistic, StatisticGroup, StatisticValue } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

export default function SkiSlopes() {
    const count1 = useMotionValue(0);
  const rounded1 = useTransform(count1, Math.round);

  const count2 = useMotionValue(0);
  const rounded2 = useTransform(count2, Math.round);

  const count3 = useMotionValue(0);
  const rounded3 = useTransform(count3, Math.round);

  const count4 = useMotionValue(0);
  const rounded4 = useTransform(count4, Math.round);

  useEffect(() => {
    const controls1 = animate(count1, 27, { duration: 2 });
    const controls2 = animate(count2, 50, { duration: 2 });
    const controls3 = animate(count3, 35, { duration: 2 });
    const controls4 = animate(count4, 42, { duration: 2 });

    return () => {
      controls1.stop();
      controls2.stop();
      controls3.stop();
      controls4.stop();
    };
  }, []);


  return (
    <>
    <Divider horizontal>
      <Header as='h1'>
        <Icon name='snowflake outline' />
        Ski Staze
      </Header>
    </Divider>
    <div style={{display: 'flex',
  justifyContent: 'center', // Centers horizontally
  alignItems: 'center', // Centers vertically
  textAlign: 'center'}}>
    <StatisticGroup>
        <Statistic color='red'>
          <Statistic.Value style={{margin:'10px'}}>
            <motion.pre>{rounded1}</motion.pre>
          </Statistic.Value>
        </Statistic>
        <Statistic color='blue'>
          <Statistic.Value style={{margin:'10px'}}>
            <motion.pre>{rounded2}</motion.pre>
          </Statistic.Value>
        </Statistic>
        <Statistic color='green'>
          <Statistic.Value style={{margin:'10px'}}>
            <motion.pre>{rounded3}</motion.pre>
          </Statistic.Value>
        </Statistic>
        <Statistic color='yellow'>
          <Statistic.Value style={{margin:'10px'}}>
            <motion.pre>{rounded4}</motion.pre>
          </Statistic.Value>
        </Statistic>
      </StatisticGroup>
    </div>
    
    </>
  )
}
