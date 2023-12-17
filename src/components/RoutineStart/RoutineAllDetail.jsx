import React, { useEffect, useState } from 'react';
import styles from '../../css/RoutineStart/RoutineAllDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

export default function RoutineAllDetail(props) {
  return (
    <div className={styles.allRoutinePopup}>
      <div className={styles.allRoutine}>
        <div className={styles.routineDetails}>
          {props.detailRoutine?.map((detail, index) =>
            detail.type ? (
              <div className={styles.detailModify} key={detail.id}>
                <div className={styles.routineDetail}>
                  <span className={styles.sequence}>{index + 1}</span>
                  <span className={styles.detailname}> {detail.ex.name}</span>
                  <div className={styles.details}>
                    <div className={styles.ex}>
                      <FontAwesomeIcon
                        icon={faDumbbell}
                        className={styles.dumbbellIcon}
                      />
                      <span> {detail.time}s</span>
                    </div>
                    <div className={styles.ex}>
                      <span className={styles.restText}>rest</span>
                      <span> {detail.rest}s</span>
                    </div>
                    <div className={styles.ex}>
                      <span> {detail.set} set</span>
                    </div>
                  </div>
                  <div className={styles.video}>동영상 들어올 자리</div>
                </div>
              </div>
            ) : (
              <div className={styles.detailModify} key={detail.id}>
                <div className={styles.routineDetail}>
                  <span className={styles.sequence}>{index + 1}</span>
                  <span className={styles.detailname}> {detail.ex.name}</span>
                  <div className={styles.details}>
                    <div className={styles.ex}>
                      <FontAwesomeIcon
                        icon={faDumbbell}
                        className={styles.dumbbellIcon}
                      />
                      <span> {detail.count}개</span>
                    </div>
                    <div className={styles.ex}>
                      <span className={styles.restText}>rest</span>
                      <span> {detail.rest}s</span>
                    </div>
                    <div className={styles.ex}>
                      <span> {detail.set} set</span>
                    </div>
                  </div>
                  <div className={styles.video}>동영상 들어올 자리</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
