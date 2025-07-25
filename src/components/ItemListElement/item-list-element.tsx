import './item-list-element-styles.scss';

import { itemData } from '../../App';

function ItemListElement({ itemData }: { itemData: itemData }) {
  return (
    <div className='list-element' title={itemData.name}>
      <img src={`items/${itemData.name}.png`}/>
      <span className='name'>{itemData.name}</span>
      <span>x{itemData.quantity}</span>
    </div>
  )
}

export default ItemListElement