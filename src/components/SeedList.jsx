import classes from './SeedList.module.css';
import SeedPacket from './SeedPacket';
import { useLoaderData } from 'react-router-dom';

function SeedList({ empty }) {
    let seedPackets = useLoaderData();
   // seedPackets = seedPackets.filter(p => ((p.isEmpty == null || !p.isEmpty) && {empty} == 'false') || (p.isEmpty && {empty} == 'true'));

    return (
        <>
            {seedPackets.length > 0 &&
            <ul className={classes.seed_packets}>
                {seedPackets.map((p) => <SeedPacket key={p.id} id={p.id} seed_type={p.seed_type} name={p.name} company={p.company} year={p.year} 
                    notes={p.notes} isEmpty={p.isEmpty}/>)}
            </ul>
            }
            {seedPackets.length === 0 && (
                <div style={{textAlign:'center', color:'white'}}>
                    <h2>You haven't added any seed packets yet.</h2>
                </div>
            )}
    
        </>
    );
}

export default SeedList;