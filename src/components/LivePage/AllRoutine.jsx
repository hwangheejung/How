import React from 'react';
import styles from '../../css/LivePage/AllRoutine.module.css';

export default function AllRoutine({ routine }) {
  return (
    <div className={styles.allRoutine}>
      <div className={styles.routineTitle}>{routine?.name}</div>
      <div className={styles.cates}>
        {routine?.cate.map((item, index) => (
          <span key={index} className={styles.actionCate}>
            #{item}
          </span>
        ))}
      </div>
      <div>
        {routine?.routineDetails?.map((detail) =>
          detail.type ? (
            <div key={detail.ex.id} className={styles.timer}>
              <span className={styles.detailname}> {detail.ex?.name}</span>
              <span> {detail.time}s</span>
              <div>
                <span>rest</span>
                <span> {detail.rest}s</span>
              </div>
              <div>
                <span>{detail.set} set</span>
              </div>
            </div>
          ) : (
            <div key={detail.ex.id} className={styles.timer}>
              <span className={styles.detailname}> {detail.ex?.name}</span>
              <span>{detail.count}개</span>
              <div>
                <span>rest</span>
                <span> {detail.rest}s</span>
              </div>
              <div>
                <span>{detail.set} set</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
